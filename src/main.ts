import * as core from '@actions/core'
import {checkPlatform} from './platform'
import {getLatestVersion} from './version'
import {installCLI} from './install'
import {cacheCLI, restoreCLI, toolPath} from './cache'

async function run(): Promise<void> {
  try {
    core.startGroup('Determining executing platform')
    const platform = checkPlatform()
    if (!platform) {
      core.setFailed('Not supported platform.')
      return
    }
    core.info(`OS: ${platform.id}`)
    core.info(`Arch: ${platform.arch}`)
    core.endGroup()

    const version = await getLatestVersion()
    const key = `configcat-cli_${version}_${platform.id}-${platform.arch}.${platform.ext}`

    const hit = await restoreCLI(key)
    core.setOutput('cache-hit', !!hit)
    if (!hit) {
      await installCLI(version, toolPath, platform)
      core.info('Caching downloaded artifact...')
      await cacheCLI(key)
    } else {
      core.info('ConfigCat CLI found in cache')
    }
    core.addPath(toolPath)
    core.setOutput('configcat-version', version)
    core.info(`ConfigCat CLI v${version} installed successfully.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
