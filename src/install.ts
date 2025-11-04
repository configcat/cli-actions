import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {Platform} from './platform'

export async function installCLI(version: string, dest: string, platform: Platform): Promise<void> {
  core.startGroup('ConfigCat CLI not found in cache, downloading')
  const file = `configcat-cli_${version}_${platform.id}-${platform.arch}.${platform.ext}`
  const url = `https://github.com/configcat/cli/releases/download/v${version}/${file}`
  core.info(`Downloading artifact ${`https://github.com/configcat/cli/releases/download/v${version}/${file}`}`)
  const path = await tc.downloadTool(url)
  core.info('Extracting...')
  if (platform.ext === 'zip') {
    await tc.extractZip(path, dest)
  } else {
    await tc.extractTar(path, dest)
  }
  core.endGroup()
}
