// Runs the firebase CLI with a JDK the emulators accept: `node scripts/firebase-with-jdk.mts <firebase args>`
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { delimiter, join } from 'node:path'

// firebase-tools 15 refuses to start the emulators on anything older
const MIN_JAVA_MAJOR = 21

// Homebrew JDKs are keg-only, so they are installed but not on PATH
const JDK_HOME_CANDIDATES = [
  '/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
  '/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home',
  '/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home',
  '/usr/local/opt/openjdk/libexec/openjdk.jdk/Contents/Home',
]

function javaMajor(javaBin: string): number {
  // `java -version` writes to stderr
  const { stderr } = spawnSync(javaBin, ['-version'], { encoding: 'utf8' })
  const major = /version "(\d+)/.exec(stderr ?? '')?.[1]

  return major === undefined ? 0 : Number(major)
}

function emulatorEnv(): NodeJS.ProcessEnv {
  if (javaMajor('java') >= MIN_JAVA_MAJOR) return process.env

  const home = JDK_HOME_CANDIDATES.find(
    (dir) =>
      existsSync(join(dir, 'bin', 'java')) &&
      javaMajor(join(dir, 'bin', 'java')) >= MIN_JAVA_MAJOR
  )

  if (home === undefined) {
    throw new Error(
      `The Firebase emulators need JDK ${MIN_JAVA_MAJOR}+ (e.g. \`brew install openjdk@21\`)`
    )
  }
  return {
    ...process.env,
    JAVA_HOME: home,
    PATH: `${join(home, 'bin')}${delimiter}${process.env.PATH ?? ''}`,
  }
}

const { status } = spawnSync('firebase', process.argv.slice(2), {
  stdio: 'inherit',
  env: emulatorEnv(),
})

process.exit(status ?? 1)
