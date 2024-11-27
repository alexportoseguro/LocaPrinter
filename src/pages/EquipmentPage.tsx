import { useState } from 'react';
import { EquipmentForm } from '../components/equipment/EquipmentForm';
import { EquipmentList } from '../components/equipment/EquipmentList';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Equipment } from '../types';

export function EquipmentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const handleOpenForm = (equipment?: Equipment) => {
    setSelectedEquipment(equipment || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedEquipment(null);
    setIsFormOpen(false);
  };

  const handleSaveEquipment = async (equipmentData: Equipment) => {
    // TODO: Implementar salvamento do equipamento
    console.log('Salvando equipamento:', equipmentData);
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Equipamentos
        </h1>
        <Button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Novo Equipamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EquipmentList onEdit={handleOpenForm} />
        </div>
        
        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Resumo</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total de Equipamentos</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Em Manutenção</p>
                <p className="text-2xl font-bold text-yellow-500">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alertas</p>
                <p className="text-2xl font-bold text-red-500">0</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="all">Todos</option>
                  <option value="active">Ativos</option>
                  <option value="maintenance">Em Manutenção</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="all">Todos</option>
                  <option value="printer">Impressora</option>
                  <option value="scanner">Scanner</option>
                  <option value="multifunction">Multifuncional</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <EquipmentForm
          equipment={selectedEquipment}
          onClose={handleCloseForm}
          onSave={handleSaveEquipment}
        />
      )}
    </div>
  );
}
