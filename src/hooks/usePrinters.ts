import { useState, useEffect, useCallback } from 'react';
import { monitoringService } from '../services/monitoringService';
import { PrinterStatus, PrinterEvent, PrinterError } from '../types/printer';

interface UsePrintersResult {
  printers: PrinterStatus[];
  loading: boolean;
  error: string | null;
  getPrinter: (id: string) => PrinterStatus | undefined;
  refreshPrinter: (id: string) => Promise<void>;
  refreshAllPrinters: () => Promise<void>;
}

export function usePrinters(): UsePrintersResult {
  const [printers, setPrinters] = useState<PrinterStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePrinterUpdate = ({ printerId, status }: PrinterEvent) => {
      setPrinters(current =>
        current.map(printer =>
          printer.id === printerId ? status : printer
        )
      );
    };

    const handlePrinterError = ({ printerId, error }: PrinterError) => {
      setError(`Erro na impressora ${printerId}: ${error.message}`);
    };

    // Inscrever-se nos eventos
    monitoringService.on('printerStatusUpdated', handlePrinterUpdate);
    monitoringService.on('printerError', handlePrinterError);

    // Carregar estado inicial
    const initialStatuses = monitoringService.getAllPrinterStatuses();
    setPrinters(Array.from(initialStatuses.values()));
    setLoading(false);

    // Cleanup
    return () => {
      monitoringService.removeListener('printerStatusUpdated', handlePrinterUpdate);
      monitoringService.removeListener('printerError', handlePrinterError);
    };
  }, []);

  const getPrinter = useCallback((id: string) => {
    return printers.find(printer => printer.id === id);
  }, [printers]);

  const refreshPrinter = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await monitoringService.refreshPrinter(id);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar impressora');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAllPrinters = useCallback(async () => {
    try {
      setLoading(true);
      await monitoringService.refreshAllPrinters();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar impressoras');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    printers,
    loading,
    error,
    getPrinter,
    refreshPrinter,
    refreshAllPrinters,
  };
}
