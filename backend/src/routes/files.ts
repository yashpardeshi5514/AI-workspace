import { Router, Response } from 'express';
import { fileService } from '../services/FileService';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ragService } from 'ai-services';

const router = Router();

router.post('/upload', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { filename, content, path } = req.body;
    const { workspaceId } = req.query;

    if (!filename || !content || !workspaceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const file = await fileService.saveFile(
      workspaceId as string,
      req.userId!,
      filename,
      content,
      'text/plain',
      content.length,
      path || '/'
    );

    // Index with RAG
    try {
      await ragService.indexDocument(file._id.toString(), content, {
        filename,
        workspaceId,
        path: file.path,
      });
      await fileService.updateIndexed(file._id.toString());
    } catch (err) {
      console.error('RAG indexing error:', err);
    }

    res.status(201).json(file);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tree', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID required' });
    }

    const files = await fileService.getTree(workspaceId as string);
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/list', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId, path } = req.query;

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID required' });
    }

    const files = await fileService.getWorkspaceFiles(
      workspaceId as string,
      path as string || '/'
    );
    res.json(files);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/mkdir', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, parentPath } = req.body;
    const { workspaceId } = req.query;

    if (!name || !workspaceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dir = await fileService.createDirectory(
      workspaceId as string,
      req.userId!,
      name,
      parentPath || '/'
    );
    res.status(201).json(dir);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const file = await fileService.getFile(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (content === undefined) {
      return res.status(400).json({ error: 'Content required' });
    }

    const file = await fileService.getFile(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    file.content = content;
    file.size = content.length;
    await file.save();

    // Re-index with RAG if needed
    try {
      if (file.indexed && !file.isDirectory) {
        await ragService.indexDocument(file._id.toString(), content, {
          filename: file.filename,
          workspaceId: file.workspaceId,
          path: file.path,
        });
      }
    } catch (err) {
      console.error('RAG re-indexing error:', err);
    }

    res.json(file);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/rename', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ error: 'New name required' });
    }

    const file = await fileService.renameFile(req.params.id, newName);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/move', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { newParentPath } = req.body;
    if (!newParentPath) {
      return res.status(400).json({ error: 'New parent path required' });
    }

    const file = await fileService.moveFile(req.params.id, newParentPath);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await fileService.deleteFile(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
