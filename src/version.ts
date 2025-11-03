import * as core from '@actions/core'
import * as http from '@actions/http-client'

export interface GitHubRelease {
  id: number
  tag_name: string
}

export async function getLatestVersion(): Promise<string> {
  core.startGroup('Fetching latest CLI version')
  const url = 'https://raw.githubusercontent.com/configcat/cli/main/.version'
  core.info(`Fetching metadata from ${url}`)
  const client: http.HttpClient = new http.HttpClient('configcat/setup-cli')
  const resp: http.HttpClientResponse = await client.get(url)
  const body = await resp.readBody()
  const statusCode = resp.message.statusCode || 500
  if (statusCode >= 400) {
    throw new Error(`Failed to get latest release: status code ${statusCode}: ${body}`)
  }
  core.info(`Version: ${body}`)
  core.endGroup()
  return body
}
