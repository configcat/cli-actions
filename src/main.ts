import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {checkPlatform} from './platform'
import {getLatestVersion} from './version'
import {installAndCacheCLI} from './install'

const toolName = 'configcat'

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

    let path = tc.find(toolName, version)
    core.setOutput('cache-hit', !!path)
    if (!path) {
      path = await installAndCacheCLI(version, toolName, platform)
    } else {
      core.info('ConfigCat CLI found in cache')
    }
    core.addPath(path)
    core.setOutput('configcat-version', version)
    core.info(`ConfigCat CLI v${version} installed successfully.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
