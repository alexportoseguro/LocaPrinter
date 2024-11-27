import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { Department } from '../../types';

interface DepartmentManagerProps {
  onClose: () => void;
}

export function DepartmentManager({ onClose }: DepartmentManagerProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    responsible: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...formData, id: dept.id } 
          : dept
      ));
    } else {
      const newDepartment = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      };
      setDepartments(prev => [...prev, newDepartment]);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      responsible: '',
      phone: '',
      email: ''
    });
    setEditingDepartment(null);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData(department);
  };

  const handleDelete = (departmentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este setor?')) {
      setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gerenciar Setores</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex divide-x h-[calc(90vh-73px)]">
          {/* Formulário */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Setor
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsável
                </label>
                <input
                  type="text"
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-5 w-5" />
                  {editingDepartment ? 'Atualizar Setor' : 'Adicionar Setor'}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Setores */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="space-y-4">
              {departments.map(department => (
                <div
                  key={department.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {department.name}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(department)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {department.description && (
                    <p className="text-sm text-gray-500 mb-3">
                      {department.description}
                    </p>
                  )}

                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Responsável:</span> {department.responsible}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Telefone:</span> {department.phone}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {department.email}
                    </p>
                  </div>
                </div>
              ))}

              {departments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Nenhum setor cadastrado ainda.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
