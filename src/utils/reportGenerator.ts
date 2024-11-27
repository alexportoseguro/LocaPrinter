import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Equipment, EquipmentMetrics, ReportGenerationParams } from '../types';
import { formatCurrency, formatDate } from './formatters';

/**
 * Calcula métricas detalhadas para equipamentos
 * @param equipments Lista de equipamentos
 * @returns Métricas calculadas
 */
export const calculateEquipmentMetrics = (equipments: Equipment[]): EquipmentMetrics => {
  const totalEquipments = equipments.length;
  const activeEquipments = equipments.filter(eq => eq.status === 'Ativo').length;
  
  const maintenanceCost = equipments.reduce((total, eq) => 
    total + (eq.maintenanceHistory?.reduce((sum, maint) => sum + (maint.cost || 0), 0) || 0), 
    0
  );

  const averageMaintenanceCost = totalEquipments > 0 
    ? maintenanceCost / totalEquipments 
    : 0;

  const maintenanceFrequency = equipments.reduce((total, eq) => 
    total + (eq.maintenanceHistory?.length || 0), 
    0
  ) / totalEquipments;

  return {
    totalEquipments,
    activeEquipments,
    maintenanceCost,
    averageMaintenanceCost,
    maintenanceFrequency
  };
};

/**
 * Gera um relatório PDF de equipamentos
 * @param params Parâmetros para geração do relatório
 */
export const generateEquipmentReport = ({
  equipments, 
  title, 
  subtitle 
}: ReportGenerationParams) => {
  const doc = new jsPDF();
  
  // Adiciona título e subtítulo
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  if (subtitle) {
    doc.setFontSize(12);
    doc.text(subtitle, 14, 30);
  }

  // Prepara dados para a tabela
  const tableData = equipments.map(eq => [
    eq.code,
    eq.name,
    eq.status,
    formatCurrency(eq.purchaseValue || 0),
    eq.maintenanceHistory?.length || 0,
    formatCurrency(eq.maintenanceHistory?.reduce((sum, maint) => sum + (maint.cost || 0), 0) || 0)
  ]);

  // Adiciona tabela de equipamentos
  autoTable(doc, {
    startY: subtitle ? 40 : 32,
    head: [['Código', 'Nome', 'Status', 'Valor de Compra', 'Manutenções', 'Custo de Manutenção']],
    body: tableData,
    theme: 'striped',
    styles: { 
      fontSize: 9,
      cellPadding: 3 
    },
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255 
    }
  });

  // Adiciona rodapé com data
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Relatório gerado em: ${new Date().toLocaleString()}`, 
      14, 
      doc.internal.pageSize.height - 10
    );
  }

  // Salva o documento
  doc.save(`relatorio_equipamentos_${new Date().toISOString().split('T')[0]}.pdf`);
};
