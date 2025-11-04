import * as core from '@actions/core'
import fs from 'fs'
import {checkPlatform} from './platform'
import {getLatestVersion} from './version'
import {installCLI} from './install'

async function run(): Promise<void> {
  try {
    const platform = checkPlatform()
    const version = await getLatestVersion()
    const path = await installCLI(version, platform)

    core.info(`${path}`)
    fs.readdirSync(path).forEach(file => {
      core.info(file)
    })
    core.addPath(core.toPlatformPath(path))
    core.setOutput('configcat-version', version)
    core.info(`ConfigCat CLI v${version} installed successfully.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
