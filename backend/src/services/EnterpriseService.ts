import { Analytics, TeamMember, Integration, AuditLog } from '../models/Enterprise';

export class EnterpriseService {
  // Analytics
  async trackEvent(
    workspaceId: string,
    userId: string,
    event: string,
    data: any,
    metadata?: any
  ) {
    const analytics = await Analytics.create({
      workspaceId,
      userId,
      event,
      data,
      metadata,
    });
    return analytics;
  }

  async getAnalytics(workspaceId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await Analytics.find({
      workspaceId,
      createdAt: { $gte: startDate },
    });

    // Aggregate by event type
    const aggregated = events.reduce(
      (acc: any, event: any) => {
        if (!acc[event.event]) {
          acc[event.event] = 0;
        }
        acc[event.event]++;
        return acc;
      },
      {}
    );

    return {
      totalEvents: events.length,
      eventsByType: aggregated,
      activeUsers: new Set(events.map(e => e.userId)).size,
      timeline: this.groupByDay(events),
    };
  }

  // Team Management
  async addTeamMember(
    workspaceId: string,
    email: string,
    role: string = 'member'
  ) {
    const member = await TeamMember.create({
      workspaceId,
      email,
      role,
      status: 'invited',
      invitedAt: new Date(),
    });
    return member;
  }

  async getTeamMembers(workspaceId: string) {
    return await TeamMember.find({ workspaceId, status: { $ne: 'disabled' } });
  }

  async updateMemberRole(memberId: string, newRole: string) {
    return await TeamMember.findByIdAndUpdate(memberId, { role: newRole });
  }

  async removeMember(memberId: string) {
    return await TeamMember.findByIdAndUpdate(memberId, {
      status: 'disabled',
    });
  }

  // Integrations
  async createIntegration(
    workspaceId: string,
    type: string,
    name: string,
    config: any
  ) {
    const apiKey = this.generateApiKey();
    const integration = await Integration.create({
      workspaceId,
      type,
      name,
      config,
      apiKey,
      enabled: true,
    });
    return integration;
  }

  async getIntegrations(workspaceId: string) {
    return await Integration.find({ workspaceId });
  }

  async updateIntegration(integrationId: string, updates: any) {
    return await Integration.findByIdAndUpdate(integrationId, updates);
  }

  async verifyApiKey(apiKey: string) {
    return await Integration.findOne({ apiKey });
  }

  // Audit Logging
  async logAction(
    workspaceId: string,
    userId: string,
    action: string,
    targetType: string,
    targetId: string,
    changes?: any
  ) {
    const audit = await AuditLog.create({
      workspaceId,
      userId,
      action,
      targetType,
      targetId,
      changes,
    });
    return audit;
  }

  async getAuditLog(workspaceId: string, limit: number = 100) {
    return await AuditLog.find({ workspaceId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  // Helpers
  private groupByDay(events: any[]) {
    return events.reduce(
      (acc: any, event: any) => {
        const day = event.createdAt.toISOString().split('T')[0];
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      },
      {}
    );
  }

  private generateApiKey() {
    return 'sk_' + Math.random().toString(36).substr(2, 32);
  }
}

export const enterpriseService = new EnterpriseService();
