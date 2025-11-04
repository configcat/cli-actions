import * as core from '@actions/core'
import {checkPlatform} from './platform'
import {getLatestVersion} from './version'
import {downloadCLI} from './download'

export async function installCLI(): Promise<void> {
  try {
    const platform = checkPlatform()
    const version = await getLatestVersion()
    const path = await downloadCLI(version, platform)
    core.addPath(core.toPlatformPath(path))
    core.setOutput('configcat-version', version)
    core.info(`ConfigCat CLI v${version} installed successfully.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}
