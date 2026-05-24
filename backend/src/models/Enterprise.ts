import mongoose from 'mongoose';

// Analytics Events
const analyticsSchema = new mongoose.Schema(
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
    event: {
      type: String,
      required: true,
      enum: [
        'chat_message',
        'file_upload',
        'file_delete',
        'code_execute',
        'search_query',
        'login',
        'logout',
        'workspace_create',
        'user_invite',
      ],
    },
    data: mongoose.Schema.Types.Mixed,
    metadata: {
      ip: String,
      userAgent: String,
      duration: Number,
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ workspaceId: 1, createdAt: -1 });
analyticsSchema.index({ event: 1, createdAt: -1 });

export const Analytics = mongoose.model('Analytics', analyticsSchema);

// Team Members & Permissions
const teamMemberSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member',
    },
    permissions: {
      canEdit: Boolean,
      canDelete: Boolean,
      canInvite: Boolean,
      canManageTeam: Boolean,
    },
    status: {
      type: String,
      enum: ['active', 'invited', 'disabled'],
      default: 'active',
    },
    invitedAt: Date,
    joinedAt: Date,
  },
  { timestamps: true }
);

teamMemberSchema.index({ workspaceId: 1, userId: 1 });
teamMemberSchema.index({ workspaceId: 1, email: 1 });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

// Integrations
const integrationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['slack', 'discord', 'webhook', 'api_key'],
      required: true,
    },
    name: String,
    enabled: {
      type: Boolean,
      default: true,
    },
    config: mongoose.Schema.Types.Mixed,
    apiKey: String,
    lastUsed: Date,
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

integrationSchema.index({ workspaceId: 1, type: 1 });

export const Integration = mongoose.model('Integration', integrationSchema);

// Audit Log
const auditLogSchema = new mongoose.Schema(
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
    action: String,
    targetType: String, // user, file, chat, etc
    targetId: String,
    changes: mongoose.Schema.Types.Mixed,
    result: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ workspaceId: 1, createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
