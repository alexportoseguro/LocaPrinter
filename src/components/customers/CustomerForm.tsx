import { X } from 'lucide-react';
import { useState } from 'react';

interface CustomerFormProps {
  type: 'individual' | 'corporate';
  onClose: () => void;
}

export default function CustomerForm({ type, onClose }: CustomerFormProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {type === 'corporate' ? 'Novo Cliente (Pessoa Jurídica)' : 'Novo Cliente (Pessoa Física)'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form className="space-y-4">
          {type === 'corporate' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social
                </label>
                <input type="text" className="input-primary w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ
                </label>
                <input type="text" className="input-primary w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Fantasia
                </label>
                <input type="text" className="input-primary w-full" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input type="text" className="input-primary w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input type="text" className="input-primary w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RG
                </label>
                <input type="text" className="input-primary w-full" />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input type="email" className="input-primary w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input type="tel" className="input-primary w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input type="text" className="input-primary w-full" />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}