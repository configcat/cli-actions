import * as core from '@actions/core'
import {checkPlatform} from './platform'
import {getLatestVersion} from './version'
import {installCLI} from './install'

async function run(): Promise<void> {
  try {
    const platform = checkPlatform()
    const version = await getLatestVersion()
    const path = await installCLI(version, platform)
    core.addPath(path)
    core.setOutput('configcat-version', version)
    core.info(`ConfigCat CLI v${version} installed successfully.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
