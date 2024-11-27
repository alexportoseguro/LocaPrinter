import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  created_at: string;
  organization_id: string;
}

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'DOWNLOAD'
  | 'PRINT'
  | 'LOGIN'
  | 'LOGOUT';

export type ResourceType =
  | 'DOCUMENT'
  | 'EQUIPMENT'
  | 'REPORT'
  | 'USER'
  | 'ORGANIZATION'
  | 'SUPPORT_TICKET';

class AuditService {
  async logAction(
    action: AuditAction,
    resourceType: ResourceType,
    resourceId: string,
    details: Record<string, any> = {},
    userId: string,
    organizationId: string
  ) {
    const { error } = await supabase.from('audit_logs').insert([
      {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
        organization_id: organizationId,
      },
    ]);

    if (error) {
      console.error('Error logging audit action:', error);
      throw new Error('Failed to log audit action');
    }
  }

  async getAuditLogs(
    organizationId: string,
    filters: {
      userId?: string;
      action?: AuditAction;
      resourceType?: ResourceType;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.action) {
      query = query.eq('action', filters.action);
    }

    if (filters.resourceType) {
      query = query.eq('resource_type', filters.resourceType);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error('Failed to fetch audit logs');
    }

    return data as AuditLog[];
  }

  async getResourceHistory(resourceType: ResourceType, resourceId: string) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resource history:', error);
      throw new Error('Failed to fetch resource history');
    }

    return data as AuditLog[];
  }

  async getUserActivity(userId: string, startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user activity:', error);
      throw new Error('Failed to fetch user activity');
    }

    return data as AuditLog[];
  }

  async getOrganizationActivity(
    organizationId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching organization activity:', error);
      throw new Error('Failed to fetch organization activity');
    }

    return data as AuditLog[];
  }
}

export const auditService = new AuditService();
