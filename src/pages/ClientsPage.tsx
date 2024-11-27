import { useState } from 'react';
import { ClientForm } from '../components/clients/ClientForm';
import { ClientList } from '../components/clients/ClientList';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleOpenForm = (client?: any) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedClient(null);
    setIsFormOpen(false);
  };

  const handleSaveClient = async (clientData: any) => {
    // TODO: Implementar salvamento do cliente
    console.log('Salvando cliente:', clientData);
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Clientes
        </h1>
        <Button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Novo Cliente
        </Button>
      </div>

      <ClientList onEdit={handleOpenForm} />

      {isFormOpen && (
        <ClientForm
          client={selectedClient}
          onClose={handleCloseForm}
          onSave={handleSaveClient}
        />
      )}
    </div>
  );
}
