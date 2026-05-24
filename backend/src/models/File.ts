import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: '/',
      index: true,
    },
    isDirectory: {
      type: Boolean,
      default: false,
    },
    content: String,
    mimeType: String,
    size: Number,
    indexed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for workspace + path
fileSchema.index({ workspaceId: 1, path: 1 });

export const File = mongoose.model('File', fileSchema);

