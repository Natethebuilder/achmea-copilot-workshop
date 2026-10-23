import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'

const HOOK = fileURLToPath(new URL('../kit/.github/hooks/quality-gate.mjs', import.meta.url))
const PASS = 'node -e "process.exit(0)"'
const FAIL = 'node -e "console.log(\'1 test failed\'); process.exit(1)"'

const projects: string[] = []
afterAll(() => {
  for (const dir of projects) rmSync(dir, { recursive: true, force: true })
})

function project(packageJson?: string) {
  const dir = mkdtempSync(join(tmpdir(), 'quality-gate-'))
  projects.push(dir)
  if (packageJson !== undefined) writeFileSync(join(dir, 'package.json'), packageJson)
  return dir
}

const withScripts = (scripts: Record<string, string>) => project(JSON.stringify({ private: true, scripts }))
const shell = (command: string, cwd: string, toolName = 'powershell') => ({ toolName, toolArgs: { command }, cwd })

function runHook(event: Record<string, unknown>) {
  const result = spawnSync(process.execPath, [HOOK], { input: JSON.stringify(event), encoding: 'utf8' })
  const output = result.stdout.trim()
  return { status: result.status, output, decision: output ? JSON.parse(output) : undefined }
}

describe('quality gate hook', { timeout: 60_000 }, () => {
  const passing = withScripts({ typecheck: PASS, test: PASS })
  const failingTests = withScripts({ typecheck: PASS, test: FAIL })
  const failingTypecheck = withScripts({ typecheck: FAIL, test: PASS })

  it('stays silent for commands that do not commit or open a pull request', () => {
    const commands = ['npm run build', 'git status', 'git stash push', 'git log --grep commit', 'git push', 'gh pr merge 3']
    for (const command of commands) {
      expect(runHook(shell(command, failingTests)), command).toEqual({ status: 0, output: '', decision: undefined })
    }
  })

  it('stays silent when the project has no package.json yet', () => {
    expect(runHook(shell('git commit -m "chore: init"', project()))).toEqual({ status: 0, output: '', decision: undefined })
  })

  it('stays silent when type checking and tests pass', () => {
    expect(runHook(shell('git commit -m "feat: x"', passing))).toEqual({ status: 0, output: '', decision: undefined })
  })

  it('denies a commit while tests fail and shows the failing output', () => {
    const { status, decision } = runHook(shell('git add -A; git commit -m "feat: x"', failingTests))
    expect(status).toBe(0)
    expect(decision.permissionDecision).toBe('deny')
    expect(decision.permissionDecisionReason).toContain('`npm run test` failed')
    expect(decision.permissionDecisionReason).toContain('1 test failed')
  })

  it('gates commits and pull requests in every form', () => {
    const events = [
      shell('git commit -m "x" && git push -u origin HEAD', failingTypecheck, 'bash'),
      shell('git -C . commit -m "x"', failingTypecheck),
      shell('git --no-pager commit --amend --no-edit', failingTypecheck),
      shell('git push -u origin HEAD; gh pr create --fill', failingTypecheck),
      { toolName: 'create_pull_request', toolArgs: { title: 'feat: x' }, cwd: failingTypecheck },
      { toolName: 'bash', toolArgs: JSON.stringify({ command: 'git commit -m x' }), cwd: failingTypecheck },
    ]
    for (const event of events) {
      expect(runHook(event).decision?.permissionDecisionReason, JSON.stringify(event)).toContain(
        '`npm run typecheck` failed',
      )
    }
  })

  it('denies when package.json is not valid JSON', () => {
    expect(runHook(shell('git commit -m x', project('{ "scripts": '))).decision?.permissionDecision).toBe('deny')
  })
})
