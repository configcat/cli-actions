import * as core from '@actions/core'
import * as http from '@actions/http-client';

export interface GitHubRelease {
  id: number;
  tag_name: string;
}

export async function getLatestGitHubRelease(): Promise<GitHubRelease> {
    const url = 'https://api.github.com/repos/configcat/cli/releases/latest';
    core.info(`Fetching metadata from ${url}`)
    const client: http.HttpClient = new http.HttpClient('configcat/setup-cli');
    const resp: http.HttpClientResponse = await client.get(url);
    const body = await resp.readBody();
    const statusCode = resp.message.statusCode || 500;
    if (statusCode >= 400) {
      throw new Error(`Failed to get latest release: status code ${statusCode}: ${body}`);
    }
    const parsed = <GitHubRelease>JSON.parse(body);
    core.info(`ID: ${parsed.id}`)
    core.info(`Tag: ${parsed.tag_name}`)
    return parsed;
}