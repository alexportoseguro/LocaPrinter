import { Database } from './supabase'

export type PrinterRow = Database['public']['Tables']['printers']['Row']
export type PrinterInsert = Database['public']['Tables']['printers']['Insert']
export type PrinterUpdate = Database['public']['Tables']['printers']['Update']

export type PrintJobRow = Database['public']['Tables']['print_jobs']['Row']
export type PrintJobInsert = Database['public']['Tables']['print_jobs']['Insert']
export type PrintJobUpdate = Database['public']['Tables']['print_jobs']['Update']

export type ScanJobRow = Database['public']['Tables']['scan_jobs']['Row']
export type ScanJobInsert = Database['public']['Tables']['scan_jobs']['Insert']
export type ScanJobUpdate = Database['public']['Tables']['scan_jobs']['Update']

export type PrinterStatusRow = Database['public']['Tables']['equipment_status']['Row']
export type PrinterStatusInsert = Database['public']['Tables']['equipment_status']['Insert']
export type PrinterStatusUpdate = Database['public']['Tables']['equipment_status']['Update']

export type PrinterAlertRow = Database['public']['Tables']['equipment_alerts']['Row']
export type PrinterAlertInsert = Database['public']['Tables']['equipment_alerts']['Insert']
export type PrinterAlertUpdate = Database['public']['Tables']['equipment_alerts']['Update']

export type PrinterHistoryRow = Database['public']['Tables']['equipment_history']['Row']
export type PrinterHistoryInsert = Database['public']['Tables']['equipment_history']['Insert']
export type PrinterHistoryUpdate = Database['public']['Tables']['equipment_history']['Update']

export type PrinterCostRow = Database['public']['Tables']['equipment_costs']['Row']
export type PrinterCostInsert = Database['public']['Tables']['equipment_costs']['Insert']
export type PrinterCostUpdate = Database['public']['Tables']['equipment_costs']['Update']

export type PrinterSustainabilityRow = Database['public']['Tables']['equipment_sustainability']['Row']
export type PrinterSustainabilityInsert = Database['public']['Tables']['equipment_sustainability']['Insert']
export type PrinterSustainabilityUpdate = Database['public']['Tables']['equipment_sustainability']['Update']

export type PrinterCertificationRow = Database['public']['Tables']['equipment_certifications']['Row']
export type PrinterCertificationInsert = Database['public']['Tables']['equipment_certifications']['Insert']
export type PrinterCertificationUpdate = Database['public']['Tables']['equipment_certifications']['Update']

export interface Supply {
  type: string;
  level: number;
  color?: string;
  estimatedRemainingPages?: number;
  lastReplaced?: string;
}

export interface PrinterStatus {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  supplies: Supply[];
  capabilities: string[];
  lastPrintJob?: PrintJobRow;
  lastMaintenance?: string;
  error?: string;
  details?: Record<string, any>;
}

export interface PrinterEvent {
  printerId: string;
  status: PrinterStatus;
  timestamp: string;
  type: 'status_change' | 'error' | 'maintenance' | 'job_complete';
  details?: Record<string, any>;
}

export interface PrinterError {
  printerId: string;
  error: Error;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  context?: Record<string, any>;
}

export interface PrinterStats {
  printerId: string;
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  totalPages: number;
  averageJobTime: number;
  uptime: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  timestamp: string;
}

export interface PrinterMaintenanceSchedule {
  printerId: string;
  nextMaintenance: string;
  maintenanceType: string;
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high';
  details?: Record<string, any>;
}

export interface PrinterSustainabilityMetrics {
  printerId: string;
  paperSaved: number;
  energySaved: number;
  co2Reduced: number;
  treesSaved: number;
  waterSaved: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  timestamp: string;
}
