import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {installCLI} from '../install'
import {lastLineOf} from './utils'

interface EvalResult {
  value: string
}

export async function evalFlag(): Promise<void> {
  core.startGroup('Validating input parameters')
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
  const userAttributes = core.getMultilineInput('user-attributes')
  const baseUrl = core.getInput('base-url')
  const dataGovernance = core.getInput('data-governance')
  const verbose = core.getBooleanInput('verbose')
  core.endGroup()

  await installCLI()

  try {
    core.startGroup('Evaluating feature flags with ConfigCat CLI')
    const args = ['eval', '-sk', sdkKey, '-fk', ...flagKeys, '--json']
    if (userAttributes.length) {
      args.push('-ua', ...userAttributes)
    }
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
      core.setFailed(`Flag evaluation failed with status code ${result.exitCode}`)
      return
    }
    if (!result.stdout) {
      core.setFailed('Flag evaluation returned with empty result.')
      return
    }
    const lastLine = lastLineOf(result.stdout)
    if (!lastLine) {
      core.setFailed('Could not determine the evaluation result.')
      return
    }

    const evalResult: Map<string, EvalResult> = new Map(Object.entries(JSON.parse(lastLine)))
    for (const item of evalResult.entries()) {
      core.setOutput(item[0], item[1].value)
    }

    core.endGroup()
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

evalFlag()
