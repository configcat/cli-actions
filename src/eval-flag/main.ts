import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {installCLI} from '../install'

export async function evalFlag(): Promise<void> {
  await installCLI()
  try {
    const sdkKey = core.getInput('sdk-key') || process.env.CONFIGCAT_SDK_KEY
    if (!sdkKey) {
      core.setFailed('Either the sdk-key parameter or the CONFIGCAT_SDK_KEY environment variable must be set.')
      return
    }
    const flagKeys = core.getMultilineInput('flag-keys')
    if (!flagKeys.length) {
      core.setFailed('At least one flag key must be set.')
      return
    }
    const baseUrl = core.getInput('base-url')
    const dataGovernance = core.getInput('data-governance')
    const verbose = core.getBooleanInput('verbose')

    const args = ['eval', '-sk', sdkKey, '-fk', ...flagKeys, '--map']
    if (baseUrl) {
      args.push('-u', baseUrl)
    }
    if (dataGovernance) {
      args.push('-dg', dataGovernance)
    }
    if (verbose) {
      args.push('-v')
    }

    const result = await exec.getExecOutput('configcat', args)
    if (result.exitCode !== 0) {
      core.setFailed(`Flag evaluation failed with status code ${result.exitCode}: ${result.stderr}`)
      return
    }
    if (!result.stdout) {
      core.setFailed(`Flag evaluation returned with empty result.`)
      return
    }

    core.info(result.stdout)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

evalFlag()
