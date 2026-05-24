// GitHub integration service
import axios from 'axios';
export class GitHubService {
    constructor(token) {
        this.token = token;
    }
    getHeaders() {
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
    async getRepositories(username) {
        const res = await axios.get(`https://api.github.com/users/${username}/repos`, { headers: this.getHeaders() });
        return res.data;
    }
    async cloneRepository(owner, repo, localPath) {
        try {
            // This would be called by backend to clone repo
            const res = await axios.post('/api/github/clone', {
                owner,
                repo,
                localPath,
            });
            return res.data.success;
        }
        catch (err) {
            console.error('Clone failed:', err);
            return false;
        }
    }
    async getFileContent(owner, repo, path, branch = 'main') {
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`, { headers: this.getHeaders() });
        if (res.data.content) {
            return Buffer.from(res.data.content, 'base64').toString('utf-8');
        }
        return null;
    }
    async listFiles(owner, repo, path = '', branch = 'main') {
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents${path ? '/' + path : ''}?ref=${branch}`, { headers: this.getHeaders() });
        return res.data;
    }
    async createPullRequest(owner, repo, title, description, headBranch, baseBranch = 'main') {
        const res = await axios.post(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            title,
            body: description,
            head: headBranch,
            base: baseBranch,
        }, { headers: this.getHeaders() });
        return res.data;
    }
    async commitAndPush(owner, repo, branch, message, changes) {
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
        }
        catch (err) {
            console.error('Commit failed:', err);
            return null;
        }
    }
    async getIssues(owner, repo, state = 'open') {
        const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=${state}`, { headers: this.getHeaders() });
        return res.data;
    }
    async createIssue(owner, repo, title, body) {
        const res = await axios.post(`https://api.github.com/repos/${owner}/${repo}/issues`, { title, body }, { headers: this.getHeaders() });
        return res.data;
    }
}
//# sourceMappingURL=GitHubService.js.map