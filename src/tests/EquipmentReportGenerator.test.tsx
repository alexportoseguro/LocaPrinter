import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EquipmentReportGenerator } from '../components/reports/EquipmentReportGenerator';
import { calculateEquipmentMetrics, generateEquipmentReport } from '../utils/reportGenerator';
import { Equipment } from '../types';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
    internal: {
      getNumberOfPages: jest.fn().mockReturnValue(1),
      pageSize: { height: 297, width: 210 }
    },
    setPage: jest.fn()
  }));
});

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('EquipmentReportGenerator', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Renderização inicial do componente', () => {
    render(<EquipmentReportGenerator equipments={mockEquipments} />);
    
    // Verificar elementos principais
    expect(screen.getByText('Relatórios de Equipamentos')).toBeInTheDocument();
    expect(screen.getByText('Total de Equipamentos')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total de equipamentos
  });

  test('Filtragem de equipamentos', () => {
    render(<EquipmentReportGenerator equipments={mockEquipments} />);
    
    // Filtrar por Ativos
    const ativosButton = screen.getByText('Ativo');
    fireEvent.click(ativosButton);
    
    // Verificar se apenas equipamentos ativos são contados
    expect(screen.getByText('1')).toBeInTheDocument(); // Total de equipamentos ativos
  });

  test('Geração de relatório PDF', () => {
    render(<EquipmentReportGenerator equipments={mockEquipments} />);
    
    const gerarRelatorioButton = screen.getByText('Gerar Relatório PDF');
    fireEvent.click(gerarRelatorioButton);
    
    // Verificar chamadas de toast e geração de PDF
    expect(toast.success).toHaveBeenCalledWith('Relatório gerado com sucesso!');
  });

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

  test('Botão de gerar relatório desabilitado quando não há equipamentos', () => {
    render(<EquipmentReportGenerator equipments={[]} />);
    
    const gerarRelatorioButton = screen.getByText('Gerar Relatório PDF');
    expect(gerarRelatorioButton).toBeDisabled();
  });

  test('Gráfico de status de equipamentos', () => {
    render(<EquipmentReportGenerator equipments={mockEquipments} />);
    
    // Verificar elementos do gráfico
    const pieChart = screen.getByRole('img', { name: /pie chart/i });
    expect(pieChart).toBeInTheDocument();
  });
});
