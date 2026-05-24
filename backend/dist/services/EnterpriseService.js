import { Analytics, TeamMember, Integration, AuditLog } from '../models/Enterprise';
export class EnterpriseService {
    // Analytics
    async trackEvent(workspaceId, userId, event, data, metadata) {
        const analytics = await Analytics.create({
            workspaceId,
            userId,
            event,
            data,
            metadata,
        });
        return analytics;
    }
    async getAnalytics(workspaceId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const events = await Analytics.find({
            workspaceId,
            createdAt: { $gte: startDate },
        });
        // Aggregate by event type
        const aggregated = events.reduce((acc, event) => {
            if (!acc[event.event]) {
                acc[event.event] = 0;
            }
            acc[event.event]++;
            return acc;
        }, {});
        return {
            totalEvents: events.length,
            eventsByType: aggregated,
            activeUsers: new Set(events.map(e => e.userId)).size,
            timeline: this.groupByDay(events),
        };
    }
    // Team Management
    async addTeamMember(workspaceId, email, role = 'member') {
        const member = await TeamMember.create({
            workspaceId,
            email,
            role,
            status: 'invited',
            invitedAt: new Date(),
        });
        return member;
    }
    async getTeamMembers(workspaceId) {
        return await TeamMember.find({ workspaceId, status: { $ne: 'disabled' } });
    }
    async updateMemberRole(memberId, newRole) {
        return await TeamMember.findByIdAndUpdate(memberId, { role: newRole });
    }
    async removeMember(memberId) {
        return await TeamMember.findByIdAndUpdate(memberId, {
            status: 'disabled',
        });
    }
    // Integrations
    async createIntegration(workspaceId, type, name, config) {
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
    async getIntegrations(workspaceId) {
        return await Integration.find({ workspaceId });
    }
    async updateIntegration(integrationId, updates) {
        return await Integration.findByIdAndUpdate(integrationId, updates);
    }
    async verifyApiKey(apiKey) {
        return await Integration.findOne({ apiKey });
    }
    // Audit Logging
    async logAction(workspaceId, userId, action, targetType, targetId, changes) {
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
    async getAuditLog(workspaceId, limit = 100) {
        return await AuditLog.find({ workspaceId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    // Helpers
    groupByDay(events) {
        return events.reduce((acc, event) => {
            const day = event.createdAt.toISOString().split('T')[0];
            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day]++;
            return acc;
        }, {});
    }
    generateApiKey() {
        return 'sk_' + Math.random().toString(36).substr(2, 32);
    }
}
export const enterpriseService = new EnterpriseService();
//# sourceMappingURL=EnterpriseService.js.map