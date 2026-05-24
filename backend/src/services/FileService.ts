import { File } from '../models/File';

export class FileService {
  async saveFile(
    workspaceId: string,
    userId: string,
    filename: string,
    content: string,
    mimeType?: string,
    size?: number,
    path: string = '/'
  ) {
    const file = await File.create({
      workspaceId,
      userId,
      filename,
      content,
      mimeType,
      size,
      path,
      isDirectory: false,
    });
    return file;
  }

  async createDirectory(
    workspaceId: string,
    userId: string,
    name: string,
    parentPath: string = '/'
  ) {
    const path = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
    const dir = await File.create({
      workspaceId,
      userId,
      filename: name,
      path,
      isDirectory: true,
    });
    return dir;
  }

  async getFile(fileId: string) {
    return await File.findById(fileId);
  }

  async getByPath(workspaceId: string, path: string) {
    return await File.findOne({ workspaceId, path });
  }

  async getWorkspaceFiles(workspaceId: string, parentPath: string = '/') {
    return await File.find({ workspaceId, path: parentPath }).sort({ isDirectory: -1, filename: 1 });
  }

  async getTree(workspaceId: string) {
    return await File.find({ workspaceId }).sort({ path: 1, isDirectory: -1 });
  }

  async renameFile(fileId: string, newName: string) {
    const file = await File.findById(fileId);
    if (!file) return null;

    const oldPath = file.path;
    const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/';
    const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

    file.filename = newName;
    file.path = newPath;
    await file.save();

    // If directory, update children paths
    if (file.isDirectory) {
      const children = await File.find({
        workspaceId: file.workspaceId,
        path: new RegExp(`^${oldPath}/`),
      });

      for (const child of children) {
        child.path = child.path.replace(oldPath, newPath);
        await child.save();
      }
    }

    return file;
  }

  async moveFile(fileId: string, newParentPath: string) {
    const file = await File.findById(fileId);
    if (!file) return null;

    const oldPath = file.path;
    const newPath = newParentPath === '/'
      ? `/${file.filename}`
      : `${newParentPath}/${file.filename}`;

    file.path = newPath;
    await file.save();

    // If directory, update children paths
    if (file.isDirectory) {
      const children = await File.find({
        workspaceId: file.workspaceId,
        path: new RegExp(`^${oldPath}/`),
      });

      for (const child of children) {
        child.path = child.path.replace(oldPath, newPath);
        await child.save();
      }
    }

    return file;
  }

  async updateIndexed(fileId: string) {
    return await File.findByIdAndUpdate(fileId, { indexed: true });
  }

  async deleteFile(fileId: string) {
    const file = await File.findById(fileId);
    if (!file) return null;

    // If directory, delete all children
    if (file.isDirectory) {
      await File.deleteMany({
        workspaceId: file.workspaceId,
        path: new RegExp(`^${file.path}/`),
      });
    }

    return await File.findByIdAndDelete(fileId);
  }

  async searchFiles(workspaceId: string, query: string) {
    return await File.find({
      workspaceId,
      filename: new RegExp(query, 'i'),
    });
  }
}

export const fileService = new FileService();
