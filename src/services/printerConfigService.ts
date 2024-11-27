import axios from 'axios';
import { PrinterConfig, PrinterConfigResponse, SaveConfigRequest, SaveConfigResponse } from '../types/printerConfig';

const API_BASE_URL = process.env.REACT_APP_PRINTER_API_URL || 'http://localhost:3000/api';

export class PrinterConfigService {
  private static instance: PrinterConfigService;
  private constructor() {}

  public static getInstance(): PrinterConfigService {
    if (!PrinterConfigService.instance) {
      PrinterConfigService.instance = new PrinterConfigService();
    }
    return PrinterConfigService.instance;
  }

  async getConfig(printerId: string): Promise<PrinterConfigResponse> {
    try {
      // Simulação - substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockConfig: PrinterConfig = {
        name: `Impressora ${printerId}`,
        location: 'Escritório Principal',
        department: 'TI',
        ipAddress: '192.168.1.100',
        defaultPaperSize: 'A4',
        defaultQuality: 'normal',
        colorEnabled: true,
        duplexEnabled: true,
        maxJobSize: 100,
        alertEmail: 'admin@empresa.com',
        maintenanceSchedule: 'monthly',
        securityLevel: 'medium',
      };

      return {
        success: true,
        config: mockConfig,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao carregar configurações',
      };
    }
  }

  async saveConfig(request: SaveConfigRequest): Promise<SaveConfigResponse> {
    try {
      // Simulação - substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Configurações salvas com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao salvar configurações',
      };
    }
  }

  async testConnection(ipAddress: string): Promise<boolean> {
    try {
      // Simulação - substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      return false;
    }
  }

  async validateConfig(config: PrinterConfig): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validar endereço IP
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(config.ipAddress)) {
      errors.push('Endereço IP inválido');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(config.alertEmail)) {
      errors.push('Email inválido');
    }

    // Validar tamanho máximo do trabalho
    if (config.maxJobSize < 1 || config.maxJobSize > 1000) {
      errors.push('Tamanho máximo do trabalho deve estar entre 1 e 1000 MB');
    }

    // Validar campos obrigatórios
    if (!config.name.trim()) {
      errors.push('Nome da impressora é obrigatório');
    }
    if (!config.location.trim()) {
      errors.push('Localização é obrigatória');
    }
    if (!config.department.trim()) {
      errors.push('Departamento é obrigatório');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
