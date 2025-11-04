import * as cache from '@actions/cache'
import * as core from '@actions/core'

export const toolPath = './tools/configcat'

export async function restoreCLI(key: string): Promise<string | undefined> {
  return await cache.restoreCache([toolPath], key)
}

export async function cacheCLI(key: string): Promise<void> {
  try {
    await cache.saveCache([toolPath], key)
  } catch (error) {
    core.warning(`Couldn't cache ConfigCat CLI: ${(error as Error).message}`)
  }
}
