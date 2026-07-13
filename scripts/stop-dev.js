const { existsSync, readFileSync, rmSync } = require('fs')
const { execSync } = require('child_process')
const path = require('path')

const projectDir = process.cwd()
const lockPath = path.join(projectDir, '.next', 'dev', 'lock')

function killPid(pid) {
  if (!pid || pid === process.pid) return
  try {
    process.kill(pid, 'SIGTERM')
  } catch {
    // process may already be gone
  }
  if (process.platform === 'win32') {
    try {
      execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' })
    } catch {
      // already stopped
    }
  }
}

function killFromLockFile() {
  if (!existsSync(lockPath)) return

  try {
    const raw = readFileSync(lockPath, 'utf8').trim()
    const lock = raw.startsWith('{') ? JSON.parse(raw) : { pid: Number(raw) }
    if (lock?.pid) killPid(lock.pid)
  } catch {
    // ignore malformed lock files
  }

  try {
    rmSync(lockPath, { force: true })
  } catch {
    // ignore
  }
}

function killProjectDevServersOnWindows() {
  if (process.platform !== 'win32') return

  try {
    const output = execSync(
      `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"Name='node.exe'\\" | Where-Object { $_.CommandLine -like '*${projectDir.replace(/\\/g, '\\\\')}*next dev*' } | Select-Object -ExpandProperty ProcessId"`,
      { encoding: 'utf8' }
    )
    output
      .split(/\r?\n/)
      .map((line) => Number(line.trim()))
      .filter(Boolean)
      .forEach(killPid)
  } catch {
    // no matching processes
  }
}

killFromLockFile()
killProjectDevServersOnWindows()
