import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCompany } from '../../contexts/CompanyContext';
import { Equipment } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../../utils/formatters';
import { MaintenanceModal } from '../maintenance/MaintenanceModal';
import { MaintenanceAlertList } from '../../components/maintenance/MaintenanceAlertList';
import { PlusCircle } from 'lucide-react';

const PRINT_TECHNOLOGIES = [
  { value: 'inkjet', label: 'Jato de Tinta' },
  { value: 'laser', label: 'Laser' },
  { value: 'dot-matrix', label: 'Matricial' }
];

interface EquipmentFormProps {
  equipment?: Equipment;
  onClose: () => void;
  onSave: (equipment: Equipment) => void;
}

export function EquipmentForm({ equipment, onClose, onSave }: EquipmentFormProps) {
  const { currentCompany } = useCompany();
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState<Equipment>({
    id: equipment?.id || uuidv4(),
    companyId: currentCompany?.id || '',
    name: equipment?.name || '',
    brand: equipment?.brand || '',
    model: equipment?.model || '',
    serialNumber: equipment?.serialNumber || '',
    type: equipment?.type || 'printer',
    status: equipment?.status || 'active',
    specifications: {
      dpi: equipment?.specifications?.dpi || '',
      ppm: equipment?.specifications?.ppm || '',
      voltage: equipment?.specifications?.voltage || '110v',
      hasWifi: equipment?.specifications?.hasWifi || false,
      paperSizes: equipment?.specifications?.paperSizes || [],
      printTechnology: equipment?.specifications?.printTechnology || 'laser',
      printColor: equipment?.specifications?.printColor || 'mono'
    },
    counters: {
      initial: equipment?.counters?.initial || 0,
      current: equipment?.counters?.current || 0
    },
    financial: {
      monthlyRentalRate: equipment?.financial?.monthlyRentalRate || 0,
      pageAllowance: equipment?.financial?.pageAllowance || 0,
      excessPageRate: equipment?.financial?.excessPageRate || 0
    },
    maintenance: equipment?.maintenance || {
      maintenanceHistory: []
    },
    notes: equipment?.notes || ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const updatedParent = { ...prev[parent as keyof Equipment] };
        updatedParent[child as keyof typeof updatedParent] = type === 'checkbox' ? checked : value;
        
        return {
          ...prev,
          [parent]: updatedParent
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleMonetaryInputChange = (
    field: keyof Equipment['financial'], 
    value: string
  ) => {
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    
    setFormData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        [field]: isNaN(numericValue) ? 0 : numericValue
      }
    }));
  };

  const handleAddMaintenanceRecord = (record: any) => {
    setFormData(prev => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        maintenanceHistory: [
          ...(prev.maintenance?.maintenanceHistory || []),
          record
        ]
      }
    }));
  };

  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    const updatedFormData = { ...formData, ...updatedEquipment };
    setFormData(updatedFormData);
  };

  const handleOpenMaintenanceModal = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsMaintenanceModalOpen(true);
  };

  const handleMaintenanceModalSave = (record: any) => {
    handleAddMaintenanceRecord(record);
    setIsMaintenanceModalOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validações de especificações técnicas
    if (!formData.specifications.dpi.trim()) {
      errors.dpi = 'Resolução é obrigatória';
    } else if (!/^\d+x\d+$/.test(formData.specifications.dpi)) {
      errors.dpi = 'Formato de resolução inválido (ex: 1200x1200)';
    }

    if (!formData.specifications.ppm.trim()) {
      errors.ppm = 'Velocidade de impressão é obrigatória';
    } else if (isNaN(Number(formData.specifications.ppm))) {
      errors.ppm = 'Velocidade deve ser um número';
    }

    // Validações de contadores
    if (formData.counters.initial < 0) {
      errors.initialCounter = 'Contador inicial não pode ser negativo';
    }

    if (formData.counters.current < formData.counters.initial) {
      errors.currentCounter = 'Contador atual não pode ser menor que o inicial';
    }

    // Validações financeiras
    if (formData.financial.monthlyRentalRate < 0) {
      errors.monthlyRentalRate = 'Valor de locação não pode ser negativo';
    }

    if (formData.financial.pageAllowance < 0) {
      errors.pageAllowance = 'Franquia de páginas não pode ser negativa';
    }

    if (formData.financial.excessPageRate < 0) {
      errors.excessPageRate = 'Valor de página excedente não pode ser negativo';
    }

    // Se houver erros, atualiza estado de erros e retorna false
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valida o formulário antes de submeter
    if (validateForm()) {
      // Gera um ID se não existir
      const equipmentToSubmit = {
        ...formData,
        id: formData.id || uuidv4(),
        companyId: currentCompany?.id
      };

      // Chama a função de submissão passada como prop
      onSave(equipmentToSubmit);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl 
        w-[95%] max-w-[1200px] max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Cadastro de Equipamento
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Equipamento
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Número de Série
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Equipamento
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="printer">Impressora</option>
                    <option value="scanner">Scanner</option>
                    <option value="multifunction">Multifuncional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="active">Ativo</option>
                    <option value="maintenance">Em Manutenção</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Especificações Técnicas */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resolução (DPI)
                  </label>
                  <input
                    type="text"
                    name="specifications.dpi"
                    value={formData.specifications.dpi}
                    onChange={handleInputChange}
                    placeholder="Ex: 1200x1200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formErrors.dpi && <p className="text-red-500 text-sm mt-1">{formErrors.dpi}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Velocidade (PPM)
                  </label>
                  <input
                    type="text"
                    name="specifications.ppm"
                    value={formData.specifications.ppm}
                    onChange={handleInputChange}
                    placeholder="Ex: 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formErrors.ppm && <p className="text-red-500 text-sm mt-1">{formErrors.ppm}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tecnologia de Impressão
                  </label>
                  <select
                    name="specifications.printTechnology"
                    value={formData.specifications.printTechnology}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {PRINT_TECHNOLOGIES.map((tech) => (
                      <option key={tech.value} value={tech.value}>
                        {tech.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Informações Financeiras */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Informações Financeiras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor de Locação Mensal
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      R$
                    </span>
                    <input
                      type="text"
                      name="monthlyRentalRate"
                      value={formatCurrency(formData.financial.monthlyRentalRate)}
                      onChange={(e) => handleMonetaryInputChange('monthlyRentalRate', e.target.value)}
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  {formErrors.monthlyRentalRate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.monthlyRentalRate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Franquia de Páginas
                  </label>
                  <input
                    type="number"
                    name="pageAllowance"
                    value={formData.financial.pageAllowance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {formErrors.pageAllowance && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.pageAllowance}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Página Excedente
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      R$
                    </span>
                    <input
                      type="text"
                      name="excessPageRate"
                      value={formatCurrency(formData.financial.excessPageRate)}
                      onChange={(e) => handleMonetaryInputChange('excessPageRate', e.target.value)}
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  {formErrors.excessPageRate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.excessPageRate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de Histórico de Manutenções */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Histórico de Manutenções
                </h3>
                <button
                  type="button"
                  onClick={() => handleOpenMaintenanceModal(formData)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Manutenção
                </button>
              </div>

              {formData.maintenance?.maintenanceHistory && formData.maintenance.maintenanceHistory.length > 0 ? (
                <div className="space-y-2">
                  {formData.maintenance.maintenanceHistory.map((record, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {record.type} - {record.description}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Data: {new Date(record.date).toLocaleDateString()} | 
                          Técnico: {record.technician} | 
                          Custo: {formatCurrency(record.cost)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Nenhuma manutenção registrada
                </p>
              )}
            </div>

            {/* Lista de Equipamentos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Lista de Equipamentos</h2>
                {/*filteredEquipments.map(equipment => (
                  <EquipmentCard
                    key={equipment.id}
                    equipment={equipment}
                    onEdit={handleEditEquipment}
                    onDelete={handleDeleteEquipment}
                  />
                ))*/}
              </div>
              <div>
                <MaintenanceAlertList equipments={[]} />
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="mt-6 flex justify-end space-x-3 sticky bottom-0 bg-white dark:bg-gray-800 py-4 z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
      {isMaintenanceModalOpen && (
        <MaintenanceModal
          isOpen={isMaintenanceModalOpen}
          onClose={() => setIsMaintenanceModalOpen(false)}
          onSave={handleMaintenanceModalSave}
          onUpdateEquipment={handleUpdateEquipment}
          equipment={selectedEquipment}
        />
      )}
    </motion.div>
  );
}
