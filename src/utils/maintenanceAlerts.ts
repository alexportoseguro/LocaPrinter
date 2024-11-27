import { Equipment } from '../types';

export type MaintenanceAlertStatus = 'ok' | 'warning' | 'urgent' | 'overdue';

export interface MaintenanceAlert {
  equipmentId: string;
  equipmentName: string;
  status: MaintenanceAlertStatus;
  daysUntilMaintenance: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

export function calculateMaintenanceAlert(equipment: Equipment): MaintenanceAlert {
  // Se não tem histórico de manutenção, retorna status OK
  if (!equipment.maintenance?.maintenanceHistory || equipment.maintenance.maintenanceHistory.length === 0) {
    return {
      equipmentId: equipment.id || '',
      equipmentName: equipment.name,
      status: 'ok',
      daysUntilMaintenance: Infinity
    };
  }

  // Pega o último registro de manutenção
  const sortedMaintenance = equipment.maintenance.maintenanceHistory.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastMaintenance = sortedMaintenance[0];

  // Calcula próxima data de manutenção (a cada 6 meses)
  const lastMaintenanceDate = new Date(lastMaintenance.date);
  const nextMaintenanceDate = new Date(lastMaintenanceDate);
  nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 6);

  // Calcula dias até próxima manutenção
  const today = new Date();
  const daysUntilMaintenance = Math.ceil(
    (nextMaintenanceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Determina status do alerta
  let status: MaintenanceAlertStatus = 'ok';
  if (daysUntilMaintenance < 0) {
    status = 'overdue';
  } else if (daysUntilMaintenance <= 15) {
    status = 'urgent';
  } else if (daysUntilMaintenance <= 30) {
    status = 'warning';
  }

  return {
    equipmentId: equipment.id || '',
    equipmentName: equipment.name,
    status,
    daysUntilMaintenance,
    lastMaintenanceDate,
    nextMaintenanceDate
  };
}

export function getMaintenanceAlertColor(status: MaintenanceAlertStatus): string {
  switch (status) {
    case 'ok': return 'text-green-500';
    case 'warning': return 'text-yellow-500';
    case 'urgent': return 'text-orange-500';
    case 'overdue': return 'text-red-500';
  }
}

export function getMaintenanceAlertIcon(status: MaintenanceAlertStatus) {
  switch (status) {
    case 'ok': return 'CheckCircle';
    case 'warning': return 'AlertTriangle';
    case 'urgent': return 'AlertOctagon';
    case 'overdue': return 'XCircle';
  }
}
