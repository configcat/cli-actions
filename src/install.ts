import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import path from 'path';
import {Platform} from './platform'

const toolName = 'configcat'

export async function installCLI(version: string, platform: Platform): Promise<string> {
  let cliPath = tc.find(toolName, version)
  if (!cliPath) {
    core.startGroup('ConfigCat CLI not found in tool cache, downloading')
    const file = `configcat-cli_${version}_${platform.id}-${platform.arch}.${platform.ext}`
    const url = `https://github.com/configcat/cli/releases/download/v${version}/${file}`
    core.info(`Downloading artifact ${`https://github.com/configcat/cli/releases/download/v${version}/${file}`}`)
    cliPath = await tc.downloadTool(url)
    core.info('Extracting...')
    if (platform.ext === 'zip') {
      cliPath = await tc.extractZip(cliPath)
      cliPath = path.join(cliPath, `${platform.id}-${platform.arch}`)
    } else {
      cliPath = await tc.extractTar(cliPath)
    }
    cliPath = await tc.cacheDir(cliPath, toolName, version)
    core.endGroup()
  } else {
    core.info('ConfigCat CLI found in tool cache')
  }
  return cliPath
}
