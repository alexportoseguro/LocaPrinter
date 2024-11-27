import { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { v4 as uuidv4 } from 'uuid';

export function CompanyManager() {
  const { companies, addCompany, updateCompany, deleteCompany, setCurrentCompany } = useCompany();
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length !== 14) return false;
    return true; // Simplified validation
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!validateCNPJ(cnpj)) {
      setError('CNPJ inválido');
      return;
    }

    const company = {
      id: editingId || uuidv4(),
      name: name.trim(),
      cnpj: formatCNPJ(cnpj),
    };

    if (editingId) {
      updateCompany(company);
    } else {
      addCompany(company);
    }

    setName('');
    setCnpj('');
    setEditingId(null);
  };

  const handleEdit = (company: { id: string; name: string; cnpj: string }) => {
    setName(company.name);
    setCnpj(company.cnpj);
    setEditingId(company.id);
  };

  const handleDelete = (id: string) => {
    deleteCompany(id);
  };

  const handleSelect = (company: { id: string; name: string; cnpj: string }) => {
    setCurrentCompany(company);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Gerenciar Empresas
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome da Empresa
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Nome da empresa"
            />
          </div>

          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="00.000.000/0000-00"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
          >
            {editingId ? 'Atualizar Empresa' : 'Adicionar Empresa'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{company.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{company.cnpj}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSelect(company)}
                className="px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded"
              >
                Selecionar
              </button>
              <button
                onClick={() => handleEdit(company)}
                className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {companies.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Nenhuma empresa cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
