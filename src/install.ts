import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {Platform} from './platform'

export async function installAndCacheCLI(version: string, toolName: string, platform: Platform): Promise<string> {
  core.startGroup('ConfigCat CLI not found in cache, downloading')
  const file = `configcat-cli_${version}_${platform.id}-${platform.arch}.${platform.ext}`
  const url = `https://github.com/configcat/cli/releases/download/v${version}/${file}`
  core.info(`Downloading artifact ${`https://github.com/configcat/cli/releases/download/v${version}/${file}`}`)
  let path = await tc.downloadTool(url)
  core.info('Extracting...')
  if (platform.ext === 'zip') {
    path = await tc.extractZip(path)
  } else {
    path = await tc.extractTar(path)
  }
  core.info('Caching downloaded artifact...')
  path = await tc.cacheDir(path, toolName, version)
  core.endGroup()
  return path
}
