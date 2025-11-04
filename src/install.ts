import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {Platform} from './platform'

const toolName = 'configcat'

export async function installCLI(version: string, platform: Platform): Promise<string> {
  let path = tc.find(toolName, version)
  if (!path) {
    core.startGroup('ConfigCat CLI not found in tool cache, downloading')
    const file = `configcat-cli_${version}_${platform.id}-${platform.arch}.${platform.ext}`
    const url = `https://github.com/configcat/cli/releases/download/v${version}/${file}`
    core.info(`Downloading artifact ${`https://github.com/configcat/cli/releases/download/v${version}/${file}`}`)
    path = await tc.downloadTool(url)
    core.info('Extracting...')
    if (platform.ext === 'zip') {
      path = await tc.extractZip(path)
    } else {
      path = await tc.extractTar(path)
    }
    path = await tc.cacheDir(path, toolName, version)
    core.endGroup()
  } else {
    core.info('ConfigCat CLI found in tool cache')
  }
  return path
}
