import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  DollarSign, 
  BarChart2, 
  Calendar, 
  PieChart 
} from 'lucide-react';

interface MaintenanceRecord {
  date: Date;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

interface MaintenanceReportProps {
  maintenanceHistory: MaintenanceRecord[];
}

export function MaintenanceReport({ maintenanceHistory }: MaintenanceReportProps) {
  const reportAnalytics = useMemo(() => {
    if (!maintenanceHistory || maintenanceHistory.length === 0) {
      return {
        totalMaintenances: 0,
        totalCost: 0,
        averageCostPerMaintenance: 0,
        maintenanceTypeDistribution: {},
        maintenanceFrequencyByMonth: {},
      };
    }

    const totalMaintenances = maintenanceHistory.length;
    const totalCost = maintenanceHistory.reduce((sum, record) => sum + record.cost, 0);
    const averageCostPerMaintenance = totalCost / totalMaintenances;

    // Distribuição por tipo de manutenção
    const maintenanceTypeDistribution = maintenanceHistory.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Frequência de manutenções por mês
    const maintenanceFrequencyByMonth = maintenanceHistory.reduce((acc, record) => {
      const month = new Date(record.date).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMaintenances,
      totalCost,
      averageCostPerMaintenance,
      maintenanceTypeDistribution,
      maintenanceFrequencyByMonth,
    };
  }, [maintenanceHistory]);

  const renderMaintenanceTypeChart = () => {
    const { maintenanceTypeDistribution } = reportAnalytics;
    const totalTypes = Object.values(maintenanceTypeDistribution).reduce((a, b) => a + b, 0);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <PieChart className="mr-2 text-indigo-600" />
          Distribuição por Tipo de Manutenção
        </h3>
        <div className="space-y-2">
          {Object.entries(maintenanceTypeDistribution).map(([type, count]) => (
            <div key={type} className="flex items-center">
              <div 
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2"
                title={`${type}: ${count} (${((count / totalTypes) * 100).toFixed(1)}%)`}
              >
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${(count / totalTypes) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {type} ({count})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMaintenanceFrequencyChart = () => {
    const { maintenanceFrequencyByMonth } = reportAnalytics;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart2 className="mr-2 text-indigo-600" />
          Frequência de Manutenções por Mês
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(maintenanceFrequencyByMonth).map(([month, count]) => (
            <div 
              key={month} 
              className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-center"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {month}
              </p>
              <p className="text-lg font-bold text-indigo-600">
                {count}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
          <Wrench className="mr-3 text-indigo-600" />
          Relatório de Manutenções
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="flex justify-center items-center mb-2">
              <Wrench className="mr-2 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Total de Manutenções
              </h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600">
              {reportAnalytics.totalMaintenances}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="flex justify-center items-center mb-2">
              <DollarSign className="mr-2 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Custo Total
              </h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              R$ {reportAnalytics.totalCost.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="flex justify-center items-center mb-2">
              <Calendar className="mr-2 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Custo Médio
              </h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              R$ {reportAnalytics.averageCostPerMaintenance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {renderMaintenanceTypeChart()}
          {renderMaintenanceFrequencyChart()}
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 className="mr-2 text-indigo-600" />
            Histórico Detalhado de Manutenções
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Data</th>
                  <th scope="col" className="px-4 py-3">Tipo</th>
                  <th scope="col" className="px-4 py-3">Descrição</th>
                  <th scope="col" className="px-4 py-3">Técnico</th>
                  <th scope="col" className="px-4 py-3 text-right">Custo</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((record, index) => (
                  <tr 
                    key={index} 
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 py-3">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">{record.type}</td>
                    <td className="px-4 py-3">{record.description}</td>
                    <td className="px-4 py-3">{record.technician}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      R$ {record.cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
