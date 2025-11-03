import * as http from '@actions/http-client';

export interface GitHubRelease {
  id: number;
  tag_name: string;
}

export async function getLatestGitHubRelease(): Promise<GitHubRelease> {
    const client: http.HttpClient = new http.HttpClient('configcat/setup-cli');
    const resp: http.HttpClientResponse = await client.get('https://api.github.com/repos/configcat/cli/releases/latest');
    const body = await resp.readBody();
    const statusCode = resp.message.statusCode || 500;
    if (statusCode >= 400) {
      throw new Error(`Failed to get latest release: status code ${statusCode}: ${body}`);
    }
    return <GitHubRelease>JSON.parse(body);
}