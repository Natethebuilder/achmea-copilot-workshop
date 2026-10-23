// Quality gate: a GitHub Copilot preToolUse hook that blocks commits and pull requests while
// `npm run typecheck` or `npm test` fails. Pushes and merges only move commits that already
// passed, so they aren't checked again. It prints nothing when a tool call isn't gated or the
// checks pass, so the normal permission flow still applies.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const CHECKS = ['typecheck', 'test']
const CHECK_TIMEOUT_MS = 50_000
const GATED_TOOLS = new Set(['create_pull_request'])
const GATED_COMMAND = /\bgit(?:\.exe)?(?:\s+(?:-[Cc]\s+\S+|--?[\w-]+(?:=\S+)?))*\s+commit\b|\bgh(?:\.exe)?\s+pr\s+create\b/

function readEvent() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    return {}
  }
}

function shellCommand(toolArgs) {
  let args = toolArgs
  if (typeof args === 'string') {
    try {
      args = JSON.parse(args)
    } catch {
      return args
    }
  }
  return typeof args?.command === 'string' ? args.command : ''
}

function deny(reason) {
  console.log(JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: `Quality gate: ${reason}` }))
  process.exit(0)
}

const event = readEvent()
if (!GATED_TOOLS.has(event.toolName) && !GATED_COMMAND.test(shellCommand(event.toolArgs))) process.exit(0)

const cwd = event.cwd || process.cwd()
const packagePath = join(cwd, 'package.json')
if (!existsSync(packagePath)) process.exit(0)

let scripts = {}
try {
  scripts = JSON.parse(readFileSync(packagePath, 'utf8')).scripts ?? {}
} catch {
  deny('package.json is not valid JSON, so type checking and tests cannot run. Fix package.json first.')
}

for (const name of CHECKS.filter((check) => scripts[check])) {
  const result = spawnSync(`npm run ${name}`, {
    cwd,
    shell: true,
    encoding: 'utf8',
    timeout: CHECK_TIMEOUT_MS,
    windowsHide: true,
  })
  if (result.status === 0) continue
  const outcome = result.error?.code === 'ETIMEDOUT' ? `timed out after ${CHECK_TIMEOUT_MS / 1000}s` : 'failed'
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`
    .replace(/\x1b\[[0-9;]*m/g, '')
    .trim()
    .split(/\r?\n/)
    .slice(-20)
    .join('\n')
  deny(`\`npm run ${name}\` ${outcome}, so this commit or pull request is blocked. Fix it, then try again.\n\n${output}`)
}
