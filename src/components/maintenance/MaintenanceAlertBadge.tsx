import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertOctagon, 
  XCircle 
} from 'lucide-react';
import { 
  calculateMaintenanceAlert, 
  getMaintenanceAlertColor, 
  getMaintenanceAlertIcon 
} from '../../utils/maintenanceAlerts';
import { Equipment } from '../../types';
import Tooltip from '../../components/ui/Tooltip';

interface MaintenanceAlertBadgeProps {
  equipment: Equipment;
  showDetails?: boolean;
}

const MaintenanceAlertBadge: React.FC<MaintenanceAlertBadgeProps> = ({ 
  equipment, 
  showDetails = false 
}) => {
  const alert = calculateMaintenanceAlert(equipment);
  const IconComponent = {
    'ok': CheckCircle,
    'warning': AlertTriangle,
    'urgent': AlertOctagon,
    'overdue': XCircle
  }[alert.status];

  const renderAlertMessage = () => {
    switch (alert.status) {
      case 'ok':
        return 'Manutenção em dia';
      case 'warning':
        return `Manutenção em ${alert.daysUntilMaintenance} dias`;
      case 'urgent':
        return `Manutenção urgente em ${alert.daysUntilMaintenance} dias`;
      case 'overdue':
        return 'Manutenção atrasada';
    }
  };

  return (
    <Tooltip 
      content={renderAlertMessage()} 
      side="top"
    >
      <div className="flex items-center">
        <IconComponent 
          className={`w-5 h-5 ${getMaintenanceAlertColor(alert.status)}`} 
        />
        {showDetails && (
          <span className={`ml-2 text-sm ${getMaintenanceAlertColor(alert.status)}`}>
            {renderAlertMessage()}
          </span>
        )}
      </div>
    </Tooltip>
  );
};

export default MaintenanceAlertBadge;
