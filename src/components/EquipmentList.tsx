import { useState } from 'react';
import { Equipment, SelectOption } from '../types';
import EquipmentCard from './EquipmentCard';
import EquipmentForm from './equipment/EquipmentForm';
import { Search, Plus, Filter } from 'lucide-react';
import { defaultEquipmentTypes, defaultEquipmentStatus } from '../data/defaultOptions';
import { v4 as uuidv4 } from 'uuid';

export default function EquipmentList() {
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados adicionais para o formulário
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  // Mock de equipamentos - substituir por chamada à API
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: '1',
      companyId: '1',
      model: 'HP LaserJet Pro M428fdw',
      serialNumber: 'VNB3K12345',
      typeId: defaultEquipmentTypes[0].id,
      brand: 'HP',
      statusId: defaultEquipmentStatus[0].id,
      monthlyRate: 299.90,
      acquisitionDate: '2023-12-01',
      acquisitionCost: 3500.00,
      specifications: {
        ppm: 40,
        dpi: 1200,
        hasWifi: true,
        hasDuplex: true,
        printType: 'both',
        voltageId: '1',
        paperSizeIds: ['1', '2']
      },
      counters: {
        totalPages: 15000,
        colorPages: 5000,
        bwPages: 10000,
        lastReading: '2024-01-15'
      },
      supplies: {
        tonerModel: 'HP 258A',
        tonerCapacity: 10000,
        currentTonerLevel: 45
      },
      maintenance: {
        lastMaintenance: '2023-12-20',
        nextMaintenance: '2024-03-20',
        maintenanceHistory: []
      }
    }
  ]);

  // Funções de CRUD
  const handleEdit = (equipment: Equipment) => {
    // TODO: Implementar edição
    console.log('Editar equipamento:', equipment);
  };

  const handleDelete = (equipment: Equipment) => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      setEquipments(prev => prev.filter(e => e.id !== equipment.id));
    }
  };

  // Função para abrir o formulário de edição
  const openEditForm = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  // Função para abrir o formulário de novo equipamento
  const openNewForm = () => {
    setEditingEquipment(null);
    setShowForm(true);
  };

  // Função para salvar o equipamento (novo ou editado)
  const handleSave = (equipment: Equipment) => {
    if (editingEquipment) {
      // Atualizar equipamento existente
      setEquipments(prev => prev.map(e => e.id === equipment.id ? equipment : e));
    } else {
      // Adicionar novo equipamento
      setEquipments(prev => [...prev, { ...equipment, id: uuidv4() }]);
    }
    setShowForm(false);
  };

  // Função para cancelar o formulário
  const handleCancel = () => {
    setShowForm(false);
  };

  // Filtragem de equipamentos
  const filteredEquipments = equipments.filter(equipment => {
    const matchesSearch = equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !selectedType || equipment.typeId === selectedType;
    const matchesStatus = !selectedStatus || equipment.statusId === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-4">
      {/* Cabeçalho com botão */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Equipamentos</h1>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Novo Equipamento
        </button>
      </div>

      {/* Formulário de Equipamento */}
      {showForm && (
        <div className="mt-4">
          <EquipmentForm
            equipment={editingEquipment}
            onSave={handleSave}
            onCancel={handleCancel}
            companyId="1"
          />
        </div>
      )}

      {/* Barra de Pesquisa e Filtros */}
      <div className="mt-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por modelo, número de série..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-5 w-5" />
            Filtros
          </button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="flex gap-4 mb-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os tipos</option>
              {defaultEquipmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Todos os status</option>
              {defaultEquipmentStatus.map(status => (
                <option key={status.id} value={status.id}>{status.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Lista de Equipamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map(equipment => (
          <EquipmentCard
            key={equipment.id}
            equipment={equipment}
            equipmentTypes={defaultEquipmentTypes}
            equipmentStatus={defaultEquipmentStatus}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ))}
        {filteredEquipments.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum equipamento encontrado
          </div>
        )}
      </div>
    </div>
  );
}