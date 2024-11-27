import { EventEmitter } from 'events';
import { PrinterStatus, PrintJob } from '../types/printer';

interface MonitoringOptions {
  pollInterval?: number; // in milliseconds
  retryAttempts?: number;
  retryDelay?: number; // in milliseconds
}

class PrinterMonitoringService extends EventEmitter {
  private pollInterval: number;
  private retryAttempts: number;
  private retryDelay: number;
  private monitoredPrinters: Map<string, PrinterStatus>;
  private pollingTimeouts: Map<string, NodeJS.Timeout>;
  private isPolling: boolean;

  constructor(options: MonitoringOptions = {}) {
    super();
    this.pollInterval = options.pollInterval || 30000; // 30 seconds default
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 5000; // 5 seconds default
    this.monitoredPrinters = new Map();
    this.pollingTimeouts = new Map();
    this.isPolling = false;
  }

  public async startMonitoring(printerId: string): Promise<void> {
    if (this.pollingTimeouts.has(printerId)) {
      return; // Already monitoring this printer
    }

    await this.updatePrinterStatus(printerId);
    this.setupPolling(printerId);
  }

  public stopMonitoring(printerId: string): void {
    const timeout = this.pollingTimeouts.get(printerId);
    if (timeout) {
      clearTimeout(timeout);
      this.pollingTimeouts.delete(printerId);
    }
    this.monitoredPrinters.delete(printerId);
  }

  public getPrinterStatus(printerId: string): PrinterStatus | undefined {
    return this.monitoredPrinters.get(printerId);
  }

  public getAllPrinterStatuses(): Map<string, PrinterStatus> {
    return new Map(this.monitoredPrinters);
  }

  private async updatePrinterStatus(printerId: string, attempt: number = 0): Promise<void> {
    try {
      const status = await this.fetchPrinterStatus(printerId);
      this.monitoredPrinters.set(printerId, status);
      this.emit('printerStatusUpdated', { printerId, status });
    } catch (error) {
      if (attempt < this.retryAttempts) {
        setTimeout(() => {
          this.updatePrinterStatus(printerId, attempt + 1);
        }, this.retryDelay);
      } else {
        this.emit('printerError', { printerId, error });
      }
    }
  }

  private setupPolling(printerId: string): void {
    const poll = async () => {
      await this.updatePrinterStatus(printerId);
      if (this.pollingTimeouts.has(printerId)) {
        this.pollingTimeouts.set(
          printerId,
          setTimeout(poll, this.pollInterval)
        );
      }
    };

    this.pollingTimeouts.set(
      printerId,
      setTimeout(poll, this.pollInterval)
    );
  }

  // Simulação de chamada à API da impressora - substituir pela integração real
  private async fetchPrinterStatus(printerId: string): Promise<PrinterStatus> {
    // Simula uma latência de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Gera dados simulados para teste
    const supplies = [
      { type: 'Toner Preto', level: Math.floor(Math.random() * 100) },
      { type: 'Toner Ciano', level: Math.floor(Math.random() * 100), color: 'cyan' },
      { type: 'Toner Magenta', level: Math.floor(Math.random() * 100), color: 'magenta' },
      { type: 'Toner Amarelo', level: Math.floor(Math.random() * 100), color: 'yellow' },
    ];

    const lastPrintJob: PrintJob = {
      id: `job-${Math.floor(Math.random() * 1000)}`,
      name: 'Documento.pdf',
      status: 'completed',
      timestamp: new Date().toISOString(),
      pages: Math.floor(Math.random() * 20) + 1,
      copies: 1,
      userId: 'user-1',
      printerId: printerId,
      documentId: 'doc-1',
      submitTime: new Date().toISOString(),
      completeTime: new Date().toISOString()
    };

    return {
      id: printerId,
      name: `Impressora ${printerId}`,
      model: 'HP LaserJet Pro M404n',
      location: 'Escritório Principal',
      status: Math.random() > 0.9 ? 'offline' : 'online',
      supplies,
      capabilities: ['print', 'scan', 'copy'],
      lastPrintJob,
      lastMaintenance: new Date().toISOString(),
      error: Math.random() > 0.95 ? 'Papel atolado na bandeja 1' : undefined,
      details: {
        ipAddress: '192.168.1.100',
        macAddress: '00:11:22:33:44:55',
        firmwareVersion: '1.2.3',
        serialNumber: 'XYZ123456'
      }
    };
  }

  public async refreshPrinter(printerId: string): Promise<void> {
    await this.updatePrinterStatus(printerId);
  }

  public async refreshAllPrinters(): Promise<void> {
    const printerIds = Array.from(this.monitoredPrinters.keys());
    await Promise.all(printerIds.map(id => this.refreshPrinter(id)));
  }

  public setPollInterval(interval: number): void {
    this.pollInterval = interval;
    // Reinicia o polling para todos os impressoras com o novo intervalo
    const printerIds = Array.from(this.pollingTimeouts.keys());
    printerIds.forEach(id => {
      this.stopMonitoring(id);
      this.startMonitoring(id);
    });
  }
}

// Exportar instância única do serviço
export const printerMonitoringService = new PrinterMonitoringService();
