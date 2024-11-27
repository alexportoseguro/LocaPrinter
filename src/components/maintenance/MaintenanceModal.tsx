import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, DollarSign, User, FileText, XCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast

interface MaintenanceRecord {
  date: Date;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: MaintenanceRecord) => void;
  onUpdateEquipment: (equipment: any) => void; // Add onUpdateEquipment prop
  initialRecord?: MaintenanceRecord;
  equipment: any; // Add equipment prop
}

const MAINTENANCE_TYPES = [
  'Preventiva',
  'Corretiva',
  'Limpeza',
  'Substituição de Peças',
  'Calibração',
  'Diagnóstico'
];

export function MaintenanceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdateEquipment, // Add onUpdateEquipment prop
  initialRecord, 
  equipment // Add equipment prop
}: MaintenanceModalProps) {
  const [record, setRecord] = useState<MaintenanceRecord>({
    date: initialRecord?.date || new Date(),
    type: initialRecord?.type || '',
    description: initialRecord?.description || '',
    cost: initialRecord?.cost || 0,
    technician: initialRecord?.technician || ''
  });

  const handleChange = (field: string, value: any) => {
    setRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!record.date || !record.type || !record.description || !record.cost || !record.technician) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Criar registro de manutenção
    const maintenanceRecord: MaintenanceRecord = {
      date: new Date(record.date),
      type: record.type,
      description: record.description,
      cost: parseFloat(record.cost),
      technician: record.technician
    };

    // Adicionar ao histórico de manutenção do equipamento
    const updatedEquipment = {
      ...equipment,
      maintenance: {
        maintenanceHistory: [
          ...(equipment.maintenance?.maintenanceHistory || []),
          maintenanceRecord
        ],
        nextMaintenanceDate: new Date(
          new Date(record.date).setMonth(new Date(record.date).getMonth() + 6)
        )
      }
    };

    // Atualizar equipamento
    onUpdateEquipment(updatedEquipment);

    // Salvar registro
    onSave(maintenanceRecord);

    // Fechar modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
    >
      <div 
        className="relative w-full max-w-md mx-auto my-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 dark:border-gray-600 rounded-t">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Registro de Manutenção
          </h3>
          <button
            className="float-right text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Data da Manutenção */}
            <div>
              <label 
                htmlFor="date" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Data da Manutenção
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={record.date instanceof Date 
                    ? record.date.toISOString().split('T')[0] 
                    : new Date().toISOString().split('T')[0]
                  }
                  onChange={(e) => handleChange('date', new Date(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Tipo de Manutenção */}
            <div>
              <label 
                htmlFor="type" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tipo de Manutenção
              </label>
              <div className="relative">
                <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="type"
                  value={record.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                >
                  <option value="">Selecione o tipo</option>
                  {MAINTENANCE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Descrição
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="description"
                  value={record.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  placeholder="Detalhes da manutenção"
                />
              </div>
            </div>

            {/* Custo */}
            <div>
              <label 
                htmlFor="cost" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Custo da Manutenção
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="cost"
                  value={record.cost}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  placeholder="Valor da manutenção"
                />
              </div>
            </div>

            {/* Técnico */}
            <div>
              <label 
                htmlFor="technician" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Técnico Responsável
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="technician"
                  value={record.technician}
                  onChange={(e) => handleChange('technician', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  placeholder="Nome do técnico"
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Salvar Manutenção
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
