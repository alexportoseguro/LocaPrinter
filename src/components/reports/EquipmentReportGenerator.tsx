import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  PieChart 
} from 'lucide-react';
import { 
  generateEquipmentReport, 
  calculateEquipmentMetrics 
} from '../../utils/reportGenerator';
import { Equipment } from '../../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EquipmentReportGeneratorProps {
  equipments: Equipment[];
}

export const EquipmentReportGenerator: React.FC<EquipmentReportGeneratorProps> = ({ 
  equipments 
}) => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredEquipments = useMemo(() => 
    filterStatus 
      ? equipments.filter(eq => eq.status === filterStatus)
      : equipments, 
    [equipments, filterStatus]
  );

  const metrics = useMemo(() => 
    calculateEquipmentMetrics(filteredEquipments), 
    [filteredEquipments]
  );

  const generateReport = () => {
    try {
      generateEquipmentReport({
        equipments: filteredEquipments,
        title: 'Relatório de Equipamentos',
        subtitle: `Total de Equipamentos: ${filteredEquipments.length}`
      });
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error(error);
    }
  };

  const pieChartData = {
    labels: ['Ativos', 'Inativos'],
    datasets: [{
      data: [
        metrics.activeEquipments, 
        metrics.totalEquipments - metrics.activeEquipments
      ],
      backgroundColor: ['#10B981', '#EF4444'],
      hoverBackgroundColor: ['#059669', '#DC2626']
    }]
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <FileText className="mr-2 text-indigo-600" />
          Relatórios de Equipamentos
        </h2>
        <div className="flex space-x-2">
          {['Todos', 'Ativo', 'Inativo'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status === 'Todos' ? null : status)}
              className={`px-3 py-1 rounded-md text-sm transition-all duration-300 ${
                (filterStatus === null && status === 'Todos') || filterStatus === status
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Total de Equipamentos
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {metrics.totalEquipments}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Custo Total de Manutenção
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.maintenanceCost)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Custo Médio de Manutenção
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(metrics.averageMaintenanceCost)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="mr-2 text-indigo-600" />
            Status dos Equipamentos
          </h3>
          <div className="h-64">
            <Pie 
              data={pieChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Download className="mr-2 text-indigo-600" />
            Exportar Relatório
          </h3>
          <button
            onClick={generateReport}
            disabled={filteredEquipments.length === 0}
            className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="mr-2" />
            Gerar Relatório PDF
          </button>
        </div>
      </div>
    </div>
  );
};
