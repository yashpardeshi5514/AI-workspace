export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    private: boolean;
}
export declare class GitHubService {
    private token;
    constructor(token: string);
    private getHeaders;
    getUser(): Promise<any>;
    getRepositories(username: string): Promise<GithubRepo[]>;
    cloneRepository(owner: string, repo: string, localPath: string): Promise<boolean>;
    getFileContent(owner: string, repo: string, path: string, branch?: string): Promise<string | null>;
    listFiles(owner: string, repo: string, path?: string, branch?: string): Promise<any[]>;
    createPullRequest(owner: string, repo: string, title: string, description: string, headBranch: string, baseBranch?: string): Promise<any>;
    commitAndPush(owner: string, repo: string, branch: string, message: string, changes: {
        path: string;
        content: string;
    }[]): Promise<any>;
    getIssues(owner: string, repo: string, state?: string): Promise<any>;
    createIssue(owner: string, repo: string, title: string, body: string): Promise<any>;
}
//# sourceMappingURL=GitHubService.d.ts.map