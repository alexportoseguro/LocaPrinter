import { useMemo } from 'react';

interface MaintenanceRecord {
  date: Date;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

export function useMaintenanceAnalytics(maintenanceHistory: MaintenanceRecord[]) {
  return useMemo(() => {
    if (!maintenanceHistory || maintenanceHistory.length === 0) {
      return {
        totalMaintenances: 0,
        totalCost: 0,
        averageCostPerMaintenance: 0,
        maintenanceTypeDistribution: {},
        maintenanceFrequencyByMonth: {},
        nextScheduledMaintenance: null
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

    // Próxima manutenção agendada (baseado no histórico)
    const sortedMaintenance = maintenanceHistory.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastMaintenance = sortedMaintenance[0];
    const nextScheduledMaintenance = lastMaintenance 
      ? new Date(lastMaintenance.date.setMonth(lastMaintenance.date.getMonth() + 6)) 
      : null;

    return {
      totalMaintenances,
      totalCost,
      averageCostPerMaintenance,
      maintenanceTypeDistribution,
      maintenanceFrequencyByMonth,
      nextScheduledMaintenance
    };
  }, [maintenanceHistory]);
}
