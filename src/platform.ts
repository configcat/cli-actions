import * as os from 'os'
import * as core from '@actions/core'

export interface Platform {
  id: string
  arch: string
  ext: string
}

interface SupportedPlatform {
  id: string
  archs: string[]
}

const archs = {
  x64: 'x64',
  ia32: 'x86',
  arm: 'arm',
  arm64: 'arm64',
}

const supportedPlatforms = new Map<string, SupportedPlatform>([
  ['linux', {id: 'linux', archs: [archs.arm, archs.arm64, archs.x64]}],
  ['darwin', {id: 'osx', archs: [archs.arm64, archs.x64]}],
  ['win32', {id: 'win', archs: [archs.arm64, archs.x64, archs.ia32]}],
])

export function checkPlatform(): Platform {
  core.startGroup('Determining executing platform')
  const osPlatform = os.platform()
  const asArch = os.arch()
  const platform = supportedPlatforms.get(osPlatform)
  if (!platform || !platform.archs.includes(archs[asArch])) throw new Error('Not supported platform.')
  const result = {
    id: platform.id,
    arch: archs[asArch],
    ext: osPlatform === 'win32' ? 'zip' : 'tar.gz',
  }
  core.info(`OS: ${result.id}`)
  core.info(`Arch: ${result.arch}`)
  core.endGroup()
  return result
}
