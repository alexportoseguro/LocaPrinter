import { motion } from 'framer-motion';
import { 
  Printer, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wifi, 
  Zap, 
  Layers, 
  Palette, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { Equipment } from '../types';
import MaintenanceAlertBadge from './maintenance/MaintenanceAlertBadge';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
}

export function EquipmentCard({ equipment, onEdit, onDelete }: EquipmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'maintenance':
        return 'text-yellow-500';
      case 'inactive':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5" />;
      case 'maintenance':
        return <Settings className="h-5 w-5" />;
      case 'inactive':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Não definida';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getDaysUntilNextMaintenance = () => {
    if (!equipment.maintenance?.nextMaintenanceDate) return null;
    const today = new Date();
    const nextMaintenance = new Date(equipment.maintenance.nextMaintenanceDate);
    const diffTime = nextMaintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilNextMaintenance = getDaysUntilNextMaintenance();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MaintenanceAlertBadge equipment={equipment} />
          <span className="text-sm text-gray-600">{equipment.code}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(equipment)} 
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(equipment.id || '')} 
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between mt-4">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
            <Printer className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {equipment.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {equipment.model}
            </p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 ${getStatusColor(equipment.status)}`}>
          {getStatusIcon(equipment.status)}
          <span className="text-sm font-medium capitalize">
            {equipment.status === 'active' ? 'Ativo' :
             equipment.status === 'maintenance' ? 'Em Manutenção' :
             'Inativo'}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Número de Série
          </p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {equipment.serialNumber}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Última Manutenção
          </p>
          <p className="mt-1 text-sm text-gray-900 dark:text-white">
            {formatDate(equipment.maintenance?.lastMaintenanceDate)}
          </p>
        </div>
      </div>

      {equipment.maintenance?.nextMaintenanceDate && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Próxima Manutenção:
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(equipment.maintenance.nextMaintenanceDate)}
            </p>
            {daysUntilNextMaintenance !== null && (
              <span className={`text-sm font-medium ${
                daysUntilNextMaintenance <= 7 ? 'text-red-500' :
                daysUntilNextMaintenance <= 30 ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                ({daysUntilNextMaintenance} dias)
              </span>
            )}
          </div>
        </div>
      )}

      {equipment.notes && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {equipment.notes}
          </p>
        </div>
      )}

      {/* Nova seção de especificações técnicas */}
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          Especificações Técnicas
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              DPI: {equipment.specifications.dpi}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              PPM: {equipment.specifications.ppm}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Wi-Fi: {equipment.specifications.hasWifi ? 'Sim' : 'Não'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Tecnologia: {equipment.specifications.printTechnology}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Impressão: {equipment.specifications.printColor === 'color' ? 'Colorida' : 'Monocromática'}
            </span>
          </div>
        </div>
      </div>

      {/* Nova seção de informações financeiras */}
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          Informações Financeiras
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Locação Mensal: R$ {equipment.financial.monthlyRentalRate.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Franquia: {equipment.financial.pageAllowance} págs
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Pág. Excedente: R$ {equipment.financial.excessPageRate.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(equipment)}
          className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(equipment.id)}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Excluir
        </button>
      </div>
    </motion.div>
  );
}