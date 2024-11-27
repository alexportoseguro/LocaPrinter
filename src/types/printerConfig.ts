export interface PrinterConfig {
  name: string;
  location: string;
  department: string;
  ipAddress: string;
  defaultPaperSize: 'A4' | 'A3' | 'Letter' | 'Legal';
  defaultQuality: 'draft' | 'normal' | 'high';
  colorEnabled: boolean;
  duplexEnabled: boolean;
  maxJobSize: number;
  alertEmail: string;
  maintenanceSchedule: 'weekly' | 'monthly' | 'quarterly';
  securityLevel: 'low' | 'medium' | 'high';
}

export interface PrinterConfigResponse {
  success: boolean;
  message?: string;
  config?: PrinterConfig;
}

export interface SaveConfigRequest {
  printerId: string;
  config: PrinterConfig;
}

export interface SaveConfigResponse {
  success: boolean;
  message?: string;
}
