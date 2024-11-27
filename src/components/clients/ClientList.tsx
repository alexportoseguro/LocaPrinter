import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCompany } from '../../contexts/CompanyContext';
import { ClientForm } from './ClientForm';

interface Client {
  id: string;
  companyId: string;
  type: 'PF' | 'PJ';
  document: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export function ClientList() {
  const { currentCompany } = useCompany();
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client]);
    setIsFormOpen(false);
  };

  const handleEditClient = (client: Client) => {
    setClients(prev =>
      prev.map(c => (c.id === client.id ? client : c))
    );
    setSelectedClient(null);
    setIsFormOpen(false);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== id));
    }
  };

  // Filtra clientes pela empresa atual
  const filteredClients = clients.filter(
    client => client.companyId === currentCompany?.id
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Clientes
        </h1>
        <button
          onClick={() => {
            setSelectedClient(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Novo Cliente
        </button>
      </div>

      {isFormOpen && (
        <ClientForm
          client={selectedClient}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedClient(null);
          }}
          onSave={selectedClient ? handleEditClient : handleAddClient}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {client.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {client.document}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {client.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {client.phone}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setIsFormOpen(true);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum cliente cadastrado ainda.
          </p>
        </div>
      )}
    </div>
  );
}
