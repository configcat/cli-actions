import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {checkPlatform} from './platform'
import {getLatestGitHubRelease} from './gh-release'

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

    core.startGroup('Fetching latest CLI release metadata')
    const latestRelease = await getLatestGitHubRelease()
    const version = latestRelease.tag_name.slice(1)
    core.endGroup()

    let path = tc.find(toolName, version)
    core.setOutput('cache-hit', !!path)
    if (!path) {
      core.startGroup('ConfigCat CLI not found in cache, downloading')
      const file = `configcat-cli_${version}_${platform.id}-${platform.arch}.${platform.ext}`
      const url = `https://github.com/configcat/cli/releases/download/v${version}/${file}`
      core.info(
        `Downloading artifact ${`https://github.com/configcat/cli/releases/download/v${version}/${file}`}`
      )
      path = await tc.downloadTool(url)
      core.info('Extracting...')
      if (platform.ext === 'zip') {
        path = await tc.extractZip(path)
      } else {
        path = await tc.extractTar(path)
      }
      core.info('Caching downloaded artifact')
      path = await tc.cacheDir(path, toolName, version)
      core.endGroup()
    } else {
      core.info('ConfigCat CLI found in cache')
    }
    core.addPath(path)
    core.setOutput('configcat-version', version)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
