import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { Database } from '../types/supabase';
import { PrinterStatus, PrinterEvent, PrinterError, PrinterAlert } from '../types/printer';

// Tipos para monitoramento inteligente
export interface EquipmentStatus {
  id: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  tonerLevels: {
    black: number;
    cyan?: number;
    magenta?: number;
    yellow?: number;
  };
  paperLevels: {
    tray1: number;
    tray2?: number;
  };
  maintenanceStatus: {
    nextScheduled: Date;
    predictedIssues: PredictedIssue[];
    lastMaintenance: Date;
    totalPrints: number;
    jamFrequency: number;
  };
  performanceMetrics: {
    uptime: number;
    printVolume24h: number;
    averageResponseTime: number;
    powerConsumption: number;
    printQualityScore: number;
  };
  sustainabilityMetrics: {
    paperSaved: number;
    energyEfficiency: number;
    carbonFootprint: number;
    recycledPaperUsage: number;
  };
}

export interface PredictedIssue {
  component: string;
  probability: number;
  estimatedTimeToFailure: number;
  recommendedAction: string;
  severity: 'low' | 'medium' | 'high';
  potentialImpact: string;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'maintenance' | 'sustainability';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

class MonitoringService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private statusCache: Map<string, EquipmentStatus> = new Map();
  private alertHandlers: ((alert: Alert) => void)[] = [];
  private statusHandlers: ((status: EquipmentStatus) => void)[] = [];

  // Inicializar monitoramento para uma empresa
  async initializeCompanyMonitoring(companyId: string) {
    // Inscrever nos canais de status e alertas
    const statusChannel = supabase
      .channel(`equipment_status:${companyId}`)
      .on('*', payload => this.handleEquipmentStatusChange(payload))
      .subscribe();

    const alertsChannel = supabase
      .channel(`equipment_alerts:${companyId}`)
      .on('*', payload => this.handleAlertChange(payload))
      .subscribe();

    this.channels.set(`status_${companyId}`, statusChannel);
    this.channels.set(`alerts_${companyId}`, alertsChannel);

    // Carregar status inicial
    await this.loadInitialStatus(companyId);
  }

  // Carregar status inicial dos equipamentos
  private async loadInitialStatus(companyId: string) {
    try {
      const { data: equipmentStatus, error } = await supabase
        .from('equipment_status')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;

      if (equipmentStatus) {
        equipmentStatus.forEach(status => {
          const processedStatus = this.processEquipmentStatus(status);
          this.statusCache.set(status.equipment_id, processedStatus);
          this.statusHandlers.forEach(handler => handler(processedStatus));
        });
      }
    } catch (error) {
      console.error('Erro ao carregar status inicial:', error);
    }
  }

  // Processar mudanças de status
  private handleEquipmentStatusChange(payload: any) {
    try {
      const status = payload.new as Database['public']['Tables']['equipment_status']['Row'];
      const processedStatus = this.processEquipmentStatus(status);
      
      this.statusCache.set(status.equipment_id, processedStatus);
      this.statusHandlers.forEach(handler => handler(processedStatus));

      // Análise preditiva
      this.analyzePredictiveMaintenanceNeeds(processedStatus);
    } catch (error) {
      console.error('Erro ao processar mudança de status:', error);
    }
  }

  // Processar alertas
  private handleAlertChange(payload: any) {
    try {
      const alert = payload.new as Database['public']['Tables']['equipment_alerts']['Row'];
      this.createAlert({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.created_at,
        details: alert.context
      });
    } catch (error) {
      console.error('Erro ao processar alerta:', error);
    }
  }

  // Análise preditiva de manutenção
  private async analyzePredictiveMaintenanceNeeds(status: EquipmentStatus) {
    try {
      const analysis = await this.runPredictiveAnalysis(status);

      if (analysis.maintenanceNeeded) {
        this.createAlert({
          id: `maintenance_${status.id}_${Date.now()}`,
          type: 'maintenance',
          severity: analysis.severity,
          message: 'Manutenção preventiva recomendada',
          timestamp: new Date().toISOString(),
          details: analysis
        });
      }
    } catch (error) {
      console.error('Erro na análise preditiva:', error);
    }
  }

  // Executar análise preditiva
  private async runPredictiveAnalysis(status: EquipmentStatus) {
    // Implementar lógica de análise preditiva
    const jamFrequency = status.maintenanceStatus.jamFrequency;
    const totalPrints = status.maintenanceStatus.totalPrints;
    const daysSinceLastMaintenance = Math.floor(
      (new Date().getTime() - status.maintenanceStatus.lastMaintenance.getTime()) / (1000 * 60 * 60 * 24)
    );

    let maintenanceNeeded = false;
    let severity: 'low' | 'medium' | 'high' = 'low';

    if (jamFrequency > 0.1) {
      maintenanceNeeded = true;
      severity = 'high';
    } else if (totalPrints > 10000 || daysSinceLastMaintenance > 90) {
      maintenanceNeeded = true;
      severity = 'medium';
    }

    return {
      maintenanceNeeded,
      severity,
      jamFrequency,
      totalPrints,
      daysSinceLastMaintenance
    };
  }

  // Criar novo alerta
  private async createAlert(alert: Alert) {
    try {
      const { error } = await supabase
        .from('equipment_alerts')
        .insert({
          equipment_id: alert.id.split('_')[1],
          type: alert.type,
          severity: alert.severity,
          message: alert.message,
          status: 'active',
          context: alert.details
        });

      if (error) throw error;

      this.alertHandlers.forEach(handler => handler(alert));
      this.showAlertNotification(alert);
    } catch (error) {
      console.error('Erro ao criar alerta:', error);
    }
  }

  // Mostrar notificação de alerta
  private showAlertNotification(alert: Alert) {
    const title = this.getAlertTitle(alert);
    toast(title, {
      description: alert.message,
      action: {
        label: 'Ver detalhes',
        onClick: () => {
          // Implementar navegação para detalhes do alerta
        }
      }
    });
  }

  // Obter título do alerta baseado no tipo e severidade
  private getAlertTitle(alert: Alert): string {
    const type = alert.type.charAt(0).toUpperCase() + alert.type.slice(1);
    const severity = alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1);
    return `${type} Alert - ${severity} Priority`;
  }

  // Registrar handler para alertas
  onAlert(handler: (alert: Alert) => void) {
    this.alertHandlers.push(handler);
  }

  // Registrar handler para mudanças de status
  onStatusChange(handler: (status: EquipmentStatus) => void) {
    this.statusHandlers.push(handler);
  }

  // Obter status atual de um equipamento
  getEquipmentStatus(equipmentId: string): EquipmentStatus | undefined {
    return this.statusCache.get(equipmentId);
  }

  // Processar dados brutos de status do equipamento
  private processEquipmentStatus(rawStatus: any): EquipmentStatus {
    return {
      id: rawStatus.equipment_id,
      serialNumber: rawStatus.details?.serialNumber || '',
      status: this.determineOverallStatus(rawStatus),
      tonerLevels: rawStatus.details?.tonerLevels || {
        black: 100
      },
      paperLevels: rawStatus.details?.paperLevels || {
        tray1: 100
      },
      maintenanceStatus: {
        nextScheduled: new Date(rawStatus.details?.nextMaintenance || Date.now()),
        predictedIssues: [],
        lastMaintenance: new Date(rawStatus.details?.lastMaintenance || Date.now()),
        totalPrints: rawStatus.details?.totalPrints || 0,
        jamFrequency: rawStatus.details?.jamFrequency || 0
      },
      performanceMetrics: {
        uptime: rawStatus.details?.uptime || 100,
        printVolume24h: rawStatus.details?.printVolume24h || 0,
        averageResponseTime: rawStatus.details?.averageResponseTime || 0,
        powerConsumption: rawStatus.details?.powerConsumption || 0,
        printQualityScore: rawStatus.details?.printQualityScore || 100
      },
      sustainabilityMetrics: {
        paperSaved: rawStatus.details?.paperSaved || 0,
        energyEfficiency: rawStatus.details?.energyEfficiency || 100,
        carbonFootprint: rawStatus.details?.carbonFootprint || 0,
        recycledPaperUsage: rawStatus.details?.recycledPaperUsage || 0
      }
    };
  }

  // Determinar status geral do equipamento
  private determineOverallStatus(rawStatus: any): 'online' | 'offline' | 'error' | 'maintenance' {
    if (rawStatus.status === 'maintenance') return 'maintenance';
    if (rawStatus.status === 'error') return 'error';
    if (rawStatus.status === 'offline') return 'offline';
    return 'online';
  }

  // Cancelar todas as subscrições
  unsubscribeAll() {
    this.channels.forEach(channel => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }
}

// Exportar instância única do serviço
export const monitoringService = new MonitoringService();
