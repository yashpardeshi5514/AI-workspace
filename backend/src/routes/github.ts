import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { GitHubService } from '../services/GitHubService';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get GitHub user info
router.get('/user', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { githubToken } = req.body; // Passed from frontend after OAuth

  if (!githubToken) {
    res.status(400).json({ error: 'GitHub token required' });
    return;
  }

  const service = new GitHubService(githubToken);

  try {
    const user = await service.getUser();
    res.json(user);
  } catch (err: any) {
    res.status(401).json({ error: 'Invalid GitHub token' });
  }
}));

// List repositories
router.get('/repos/:username', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { username } = req.params;
  const { githubToken } = req.query;

  if (!githubToken) {
    res.status(400).json({ error: 'GitHub token required' });
    return;
  }

  const service = new GitHubService(githubToken as string);
  const repos = await service.getRepositories(username);

  res.json(repos);
}));

// Clone repository to workspace
router.post('/clone', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { owner, repo, workspaceId } = req.body;

  if (!owner || !repo || !workspaceId) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Backend would clone to workspace
    // using simple-git or child_process
    res.json({ success: true, message: `Cloning ${owner}/${repo}...` });
  } catch (err: any) {
    res.status(500).json({ error: 'Clone failed' });
  }
}));

// List files in repo
router.get('/repos/:owner/:repo/files', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { owner, repo } = req.params;
  const { githubToken, path = '', branch = 'main' } = req.query;

  if (!githubToken) {
    res.status(400).json({ error: 'GitHub token required' });
    return;
  }

  const service = new GitHubService(githubToken as string);
  const files = await service.listFiles(owner, repo, path as string, branch as string);

  res.json(files);
}));

// Get file content
router.get('/repos/:owner/:repo/file', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { owner, repo } = req.params;
  const { githubToken, path, branch = 'main' } = req.query;

  if (!githubToken || !path) {
    res.status(400).json({ error: 'GitHub token and path required' });
    return;
  }

  const service = new GitHubService(githubToken as string);
  const content = await service.getFileContent(owner, repo, path as string, branch as string);

  if (!content) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  res.json({ content });
}));

// Create pull request
router.post('/pr/create', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { owner, repo, title, description, headBranch, githubToken } = req.body;

  if (!githubToken || !owner || !repo || !title || !headBranch) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const service = new GitHubService(githubToken);
  const pr = await service.createPullRequest(owner, repo, title, description, headBranch);

  res.json(pr);
}));

// List issues
router.get('/repos/:owner/:repo/issues', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { owner, repo } = req.params;
  const { githubToken, state = 'open' } = req.query;

  if (!githubToken) {
    res.status(400).json({ error: 'GitHub token required' });
    return;
  }

  const service = new GitHubService(githubToken as string);
  const issues = await service.getIssues(owner, repo, state as string);

  res.json(issues);
}));

// Create issue
router.post('/issues/create', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { owner, repo, title, body, githubToken } = req.body;

  if (!githubToken || !owner || !repo || !title) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const service = new GitHubService(githubToken);
  const issue = await service.createIssue(owner, repo, title, body);

  res.json(issue);
}));

export default router;
