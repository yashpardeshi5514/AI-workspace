# Enterprise Features: Analytics, Admin, Teams, Integrations

## Overview

Production-ready enterprise features for teams, analytics, management, and integrations.

---

## 1. Analytics & Monitoring ✅

**What:** Real-time analytics dashboard tracking user behavior and platform metrics.

### Features
- Event tracking (chat, files, code execution, login, etc.)
- User activity analytics
- Usage trends over time
- Performance metrics
- Custom date ranges

### Data Collected
```typescript
event: 'chat_message' | 'file_upload' | 'code_execute' | 'login' | 'logout' | etc.
data: { any event-specific data }
metadata: { ip, userAgent, duration }
```

### API Endpoints
```
GET /api/enterprise/analytics?workspaceId=...&days=30
  Returns: {
    totalEvents: number,
    eventsByType: { event: count },
    activeUsers: number,
    timeline: { date: count }
  }

POST /api/enterprise/track
  Body: { workspaceId, event, data, metadata }
```

### Frontend Component
```tsx
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';

<AnalyticsDashboard workspaceId={workspaceId} />
```

### Example Metrics
- Total events last 30 days
- Active users count
- Average events per user
- Event type breakdown
- Daily trend chart
- Top features used

---

## 2. Team Management ✅

**What:** Invite team members with role-based permissions.

### Roles
| Role | Capabilities |
|------|--------------|
| **Owner** | Full control, can't be removed |
| **Admin** | Manage team, modify settings |
| **Member** | Use workspace, create content |
| **Viewer** | Read-only access |

### Features
- Invite team members by email
- Set roles with granular permissions
- Active/invited/disabled statuses
- Audit trail of membership changes
- Quick removal/deactivation

### API Endpoints
```
POST /api/enterprise/team/invite
  Body: { workspaceId, email, role }

GET /api/enterprise/team?workspaceId=...
  Returns: [{ email, role, status, joinedAt }]

PATCH /api/enterprise/team/:memberId/role
  Body: { role: 'admin' | 'member' | 'viewer' }

DELETE /api/enterprise/team/:memberId
  Disables member access
```

### Frontend Component
```tsx
import { TeamManagement } from '@/components/TeamManagement';

<TeamManagement workspaceId={workspaceId} />
```

### Member Properties
```typescript
{
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
  joinedAt: Date;
  invitedAt: Date;
}
```

---

## 3. Integrations ✅

**What:** Connect external services (Slack, Discord, webhooks, APIs).

### Supported Integrations
- **Webhooks** — Send events to external services
- **API Keys** — Allow third-party access
- **Slack** — Notifications and commands
- **Discord** — Chat integration

### Features
- Generate API keys for each integration
- Enable/disable per integration
- Track usage and last used
- Audit integration access
- Documentation links

### API Endpoints
```
POST /api/enterprise/integrations
  Body: { workspaceId, type, name, config }
  Returns: { apiKey, ...integration }

GET /api/enterprise/integrations?workspaceId=...
  Returns: [{ type, name, apiKey, enabled, usageCount }]

PATCH /api/enterprise/integrations/:id
  Body: { enabled: boolean, config: any }

DELETE /api/enterprise/integrations/:id
```

### Frontend Component
```tsx
import { IntegrationManager } from '@/components/IntegrationManager';

<IntegrationManager workspaceId={workspaceId} />
```

### Example Usage

**Webhook:**
```bash
curl -X POST https://your-webhook-url \
  -H "Authorization: sk_abc123" \
  -d '{"event":"chat_message","data":{...}}'
```

**Slack Integration:**
```python
# Send notifications to Slack
import requests

slack_webhook = "https://hooks.slack.com/services/YOUR/WEBHOOK"
requests.post(slack_webhook, json={
  "text": "New message in workspace"
})
```

---

## 4. Audit Logging ✅

**What:** Track all workspace actions for compliance and security.

### Events Logged
- User invitations
- Role changes
- File operations
- Settings changes
- Team modifications
- Integration creation/deletion

### API Endpoints
```
GET /api/enterprise/audit?workspaceId=...
  Returns: [{ action, targetType, targetId, changes, userId, timestamp }]

POST /api/enterprise/audit (internal use)
  Automatically logged
```

### Audit Log Schema
```typescript
{
  action: string;           // 'invite', 'role_change', 'file_delete'
  targetType: string;       // 'user', 'file', 'workspace'
  targetId: string;         // ID of target
  userId: string;           // Who did it
  changes: any;             // What changed
  timestamp: Date;          // When
  result: 'success' | 'failure';
}
```

---

## Database Models

### Analytics
```typescript
{
  workspaceId: string;
  userId: string;
  event: string;
  data: any;
  metadata: { ip, userAgent, duration };
  createdAt: Date;
}
```

### TeamMember
```typescript
{
  workspaceId: string;
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canInvite: boolean;
    canManageTeam: boolean;
  };
  status: 'active' | 'invited' | 'disabled';
  joinedAt: Date;
  invitedAt: Date;
}
```

### Integration
```typescript
{
  workspaceId: string;
  type: 'slack' | 'discord' | 'webhook' | 'api_key';
  name: string;
  config: any;
  apiKey: string;
  enabled: boolean;
  usageCount: number;
  lastUsed: Date;
}
```

### AuditLog
```typescript
{
  workspaceId: string;
  userId: string;
  action: string;
  targetType: string;
  targetId: string;
  changes: any;
  result: 'success' | 'failure';
  createdAt: Date;
}
```

---

## Integration Examples

### Slack Bot Example
```typescript
import { enterpriseService } from './services/EnterpriseService';

// On message event
socket.on('new-message', async (data) => {
  const integrations = await enterpriseService.getIntegrations(workspaceId);
  const slackIntegration = integrations.find(i => i.type === 'slack' && i.enabled);
  
  if (slackIntegration) {
    await fetch(slackIntegration.config.webhookUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: `New message: ${data.content}`
      })
    });
  }
});
```

### Webhook Example
```typescript
// Send event to webhook
const webhook = await enterpriseService.getIntegrations(workspaceId)
  .find(i => i.type === 'webhook' && i.enabled);

if (webhook) {
  await fetch(webhook.config.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${webhook.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: 'chat_message',
      data: chatData,
      timestamp: new Date()
    })
  });
}
```

---

## Security Considerations

✅ **Done:**
- API keys generated securely
- Permissions enforced server-side
- Audit trail of all actions
- Rate limiting on integrations
- Encryption of sensitive data

**Additional (recommended):**
- OAuth 2.0 for Slack/Discord
- Webhook signature verification
- Integration access tokens with expiry
- IP whitelisting for webhooks

---

## Monitoring Dashboard

Available metrics:
- Active users (today, this week, this month)
- Chat messages sent
- Files uploaded/downloaded
- Code executions
- Workspace storage usage
- API rate limit usage
- Integration call counts

---

## Usage Quotas (Premium Feature)

Configurable per workspace:
- Max team members
- Max storage (files)
- Max API calls/month
- Max concurrent users
- Max integrations

---

## Cost Model

**Free Tier:**
- Up to 3 team members
- Basic analytics (7 days)
- Up to 5 integrations

**Pro Tier ($19/mo):**
- Unlimited team members
- Full analytics (90 days)
- Unlimited integrations
- Advanced permissions

**Enterprise:**
- Custom quotas
- Dedicated support
- SSO/SAML
- Custom integrations

---

## Setting Up Enterprise Features

### 1. Update Main Server
```typescript
import enterpriseRoutes from './routes/enterprise';

app.use('/api/enterprise', enterpriseRoutes);
```

### 2. Add to Frontend
```tsx
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { TeamManagement } from '@/components/TeamManagement';
import { IntegrationManager } from '@/components/IntegrationManager';

export function AdminPanel() {
  return (
    <div className="space-y-6">
      <AnalyticsDashboard workspaceId={workspaceId} />
      <TeamManagement workspaceId={workspaceId} />
      <IntegrationManager workspaceId={workspaceId} />
    </div>
  );
}
```

### 3. Track Events
```typescript
// On any action
await enterpriseService.trackEvent(
  workspaceId,
  userId,
  'chat_message',
  { length: content.length },
  { ip: req.ip, userAgent: req.get('user-agent') }
);

// Log actions
await enterpriseService.logAction(
  workspaceId,
  userId,
  'invite_team_member',
  'user',
  newUserId,
  { email, role }
);
```

---

## Commands

```bash
# No new commands needed - use API endpoints
# Framework handles everything
```

---

**Enterprise Features Complete!**

Production-ready tools for:
- 📊 Analytics & insights
- 👥 Team management
- 🔗 Third-party integrations
- 📋 Compliance & audit logs
