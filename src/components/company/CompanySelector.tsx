import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Settings } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { Company } from '../../types';

export function CompanySelector() {
  const { currentCompany, setCurrentCompany, companies } = useCompany();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      >
        <Building2 className="w-5 h-5" />
        <span className="font-medium">
          {currentCompany?.name || 'Selecionar Empresa'}
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <div className="p-2">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  setCurrentCompany(company);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentCompany?.id === company.id
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="flex-1 text-left">{company.name}</span>
                {currentCompany?.id === company.id && (
                  <span className="text-xs bg-white text-indigo-500 px-2 py-0.5 rounded">
                    Atual
                  </span>
                )}
              </button>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
              <button
                onClick={() => {
                  // Aqui você pode navegar para a página de gerenciamento de empresas
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Empresa</span>
              </button>
              <button
                onClick={() => {
                  // Aqui você pode navegar para as configurações da empresa atual
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Configurações</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
