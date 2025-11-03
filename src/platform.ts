import process from 'node:process'

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
  arm64: 'arm64'
}

const supportedPlatforms = new Map<string, SupportedPlatform>([
  ['linux', {id: 'linux', archs: [archs.arm, archs.arm64, archs.x64]}],
  ['darwin', {id: 'osx', archs: [archs.arm64, archs.x64]}],
  ['win32', {id: 'win', archs: [archs.arm64, archs.x64, archs.ia32]}]
])

export function checkPlatform(): Platform | null {
  const plat = supportedPlatforms.get(process.platform)
  if (!plat) return null
  if (plat.archs.includes(archs[process.arch]))
    return {
      id: plat.id,
      arch: archs[process.arch],
      ext: process.platform === 'win32' ? 'zip' : 'tar.gz'
    }
  return null
}
