export interface Supply {
  type: string;
  level: number;
  color?: string;
  estimatedRemainingPages?: number;
  lastReplaced?: string;
}

export interface PrintJob {
  id: string;
  name: string;
  status: 'pending' | 'printing' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  pages: number;
  copies: number;
  userId: string;
  printerId: string;
  documentId: string;
  options?: Record<string, any>;
  error?: string;
  submitTime: string;
  completeTime?: string;
}

export interface ScanJob {
  id: string;
  name: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  userId: string;
  printerId: string;
  format: string;
  resolution: number;
  options?: Record<string, any>;
  outputPath?: string;
  error?: string;
  submitTime: string;
  completeTime?: string;
}

export interface PrinterStatus {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  supplies: Supply[];
  capabilities: string[];
  lastPrintJob?: PrintJob;
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

export interface PrinterAlert {
  id: string;
  printerId: string;
  type: 'error' | 'warning' | 'maintenance' | 'sustainability';
  severity: 'low' | 'medium' | 'high';
  message: string;
  status: 'active' | 'resolved';
  context?: Record<string, any>;
  timestamp: string;
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

export interface PrinterCost {
  printerId: string;
  costType: string;
  amount: number;
  date: string;
  details?: Record<string, any>;
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
