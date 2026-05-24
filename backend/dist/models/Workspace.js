import mongoose from 'mongoose';
const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    description: String,
}, { timestamps: true });
export const Workspace = mongoose.model('Workspace', workspaceSchema);
//# sourceMappingURL=Workspace.js.map