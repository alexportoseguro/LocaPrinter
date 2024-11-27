import { calculateEquipmentMetrics, generateEquipmentReport } from '../utils/reportGenerator';
import { Equipment } from '../types';
import jsPDF from 'jspdf';

// Mock para jsPDF e autoTable
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
    internal: {
      getNumberOfPages: jest.fn().mockReturnValue(1),
      pageSize: {
        height: 297,
        width: 210
      }
    },
    setPage: jest.fn()
  }));
});

jest.mock('jspdf-autotable', () => {
  return jest.fn();
});

describe('Relatórios de Equipamentos', () => {
  const mockEquipments: Equipment[] = [
    {
      id: '1',
      code: 'EQ001',
      name: 'Impressora Laser',
      status: 'Ativo',
      purchaseValue: 5000,
      maintenanceHistory: [
        { date: new Date(), cost: 500, description: 'Manutenção preventiva' },
        { date: new Date(), cost: 300, description: 'Troca de peças' }
      ]
    },
    {
      id: '2',
      code: 'EQ002',
      name: 'Computador',
      status: 'Inativo',
      purchaseValue: 3000,
      maintenanceHistory: [
        { date: new Date(), cost: 200, description: 'Limpeza' }
      ]
    }
  ];

  test('Cálculo de métricas de equipamentos', () => {
    const metrics = calculateEquipmentMetrics(mockEquipments);

    expect(metrics).toEqual({
      totalEquipments: 2,
      activeEquipments: 1,
      maintenanceCost: 1000,
      averageMaintenanceCost: 500,
      maintenanceFrequency: 1.5
    });
  });

  test('Geração de relatório PDF', () => {
    const mockGenerateReport = jest.fn();
    const originalSave = jsPDF.prototype.save;
    
    // Substituir método save para não salvar arquivo real durante teste
    jsPDF.prototype.save = mockGenerateReport;

    generateEquipmentReport({
      equipments: mockEquipments,
      title: 'Relatório de Teste',
      subtitle: 'Equipamentos Cadastrados'
    });

    // Verificar se o método save foi chamado
    expect(mockGenerateReport).toHaveBeenCalled();

    // Restaurar método original
    jsPDF.prototype.save = originalSave;
  });
});
