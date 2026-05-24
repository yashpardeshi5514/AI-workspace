// GitHub integration service
import axios from 'axios';

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  private: boolean;
}

export class GitHubService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      Authorization: `token ${this.token}`,
      Accept: 'application/vnd.github.v3+json',
    };
  }

  async getUser() {
    const res = await axios.get('https://api.github.com/user', {
      headers: this.getHeaders(),
    });
    return res.data;
  }

  async getRepositories(username: string) {
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      { headers: this.getHeaders() }
    );
    return res.data as GithubRepo[];
  }

  async cloneRepository(
    owner: string,
    repo: string,
    localPath: string
  ): Promise<boolean> {
    try {
      // This would be called by backend to clone repo
      const res = await axios.post('/api/github/clone', {
        owner,
        repo,
        localPath,
      });
      return res.data.success;
    } catch (err) {
      console.error('Clone failed:', err);
      return false;
    }
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch: string = 'main'
  ) {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers: this.getHeaders() }
    );

    if (res.data.content) {
      return Buffer.from(res.data.content, 'base64').toString('utf-8');
    }

    return null;
  }

  async listFiles(
    owner: string,
    repo: string,
    path: string = '',
    branch: string = 'main'
  ) {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents${
        path ? '/' + path : ''
      }?ref=${branch}`,
      { headers: this.getHeaders() }
    );

    return res.data as any[];
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    description: string,
    headBranch: string,
    baseBranch: string = 'main'
  ) {
    const res = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        title,
        body: description,
        head: headBranch,
        base: baseBranch,
      },
      { headers: this.getHeaders() }
    );

    return res.data;
  }

  async commitAndPush(
    owner: string,
    repo: string,
    branch: string,
    message: string,
    changes: { path: string; content: string }[]
  ) {
    try {
      // This would be called by backend
      const res = await axios.post('/api/github/commit', {
        owner,
        repo,
        branch,
        message,
        changes,
      });
      return res.data;
    } catch (err) {
      console.error('Commit failed:', err);
      return null;
    }
  }

  async getIssues(owner: string, repo: string, state: string = 'open') {
    const res = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}`,
      { headers: this.getHeaders() }
    );

    return res.data;
  }

  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body: string
  ) {
    const res = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      { title, body },
      { headers: this.getHeaders() }
    );

    return res.data;
  }
}
