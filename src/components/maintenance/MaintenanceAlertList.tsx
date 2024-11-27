import React from 'react';
import { Equipment } from '../../types';
import MaintenanceAlertBadge from './MaintenanceAlertBadge';
import { calculateMaintenanceAlert } from '../../utils/maintenanceAlerts';

interface MaintenanceAlertListProps {
  equipments: Equipment[];
}

export const MaintenanceAlertList: React.FC<MaintenanceAlertListProps> = ({ equipments }) => {
  // Ordena equipamentos por status de manutenção
  const sortedEquipments = equipments.sort((a, b) => {
    const alertA = calculateMaintenanceAlert(a);
    const alertB = calculateMaintenanceAlert(b);
    
    const statusPriority = {
      'overdue': 4,
      'urgent': 3,
      'warning': 2,
      'ok': 1
    };

    return statusPriority[alertB.status] - statusPriority[alertA.status];
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Alertas de Manutenção</h2>
      {sortedEquipments.map(equipment => (
        <div 
          key={equipment.id} 
          className="flex justify-between items-center border-b py-2 last:border-b-0"
        >
          <span className="font-medium">{equipment.name}</span>
          <MaintenanceAlertBadge 
            equipment={equipment} 
            showDetails={true} 
          />
        </div>
      ))}
    </div>
  );
};
