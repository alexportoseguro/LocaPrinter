import { Users, Search, Plus, Building2, User } from 'lucide-react';
import { useState } from 'react';
import CustomerForm from './CustomerForm';
import SectorManager from './SectorManager';

export default function CustomerList() {
  const [activeTab, setActiveTab] = useState<'individual' | 'corporate'>('corporate');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showSectorManager, setShowSectorManager] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSectorManager(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Building2 size={20} />
            Gerenciar Setores
          </button>
          <button 
            onClick={() => setShowCustomerForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="input-primary w-full pl-10"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex rounded-lg overflow-hidden border">
            <button
              onClick={() => setActiveTab('corporate')}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'corporate' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Building2 size={20} />
              Pessoa Jurídica
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-4 py-2 flex items-center gap-2 ${
                activeTab === 'individual' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User size={20} />
              Pessoa Física
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'corporate' ? 'Empresa' : 'Nome'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'corporate' ? 'CNPJ' : 'CPF'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipamentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Table content will be populated with actual data */}
            </tbody>
          </table>
        </div>
      </div>

      {showCustomerForm && (
        <CustomerForm 
          type={activeTab}
          onClose={() => setShowCustomerForm(false)}
        />
      )}

      {showSectorManager && (
        <SectorManager
          onClose={() => setShowSectorManager(false)}
        />
      )}
    </div>
  );
}