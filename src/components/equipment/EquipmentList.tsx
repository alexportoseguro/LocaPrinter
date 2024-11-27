import { useState } from 'react';
import { Equipment } from '../../types';
import { EquipmentCard } from '../EquipmentCard';
import { EquipmentForm } from './EquipmentForm';
import { EquipmentReportGenerator } from '../reports/EquipmentReportGenerator';
import { useCompany } from '../../contexts/CompanyContext';
import PrinterMonitor from './PrinterMonitor';
import PrinterList from './PrinterList';
import PrinterQueue from './PrinterQueue';
import PrinterStats from './PrinterStats';
import PrinterConfig from './PrinterConfig';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';

export function EquipmentList() {
  const { currentCompany } = useCompany();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleEditEquipment = (equipment: Equipment) => {
    setEquipments(prev =>
      prev.map(eq => (eq.id === equipment.id ? equipment : eq))
    );
    setSelectedEquipment(null);
    setIsEditFormOpen(false);
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipments(prev => prev.filter(eq => eq.id !== id));
  };

  // Filtra equipamentos pela empresa atual
  const filteredEquipments = equipments.filter(
    equipment => equipment.companyId === currentCompany?.id
  );

  const tabItems = ['Equipamentos', 'Impressoras', 'Fila de Impressão', 'Estatísticas', 'Configurações'];

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditFormOpen && selectedEquipment && (
        <EquipmentForm
          equipment={selectedEquipment}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedEquipment(null);
          }}
          onSave={handleEditEquipment}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Gerenciamento de Equipamentos
        </h1>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
            {tabItems.map((item) => (
              <Tab
                key={item}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'
                  }`
                }
              >
                {item}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-end space-x-4 mb-4">
                  <button
                    onClick={() => setIsEditFormOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Adicionar Equipamento
                  </button>
                  <button
                    onClick={() => setShowReports(!showReports)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {showReports ? 'Fechar Relatórios' : 'Gerar Relatórios'}
                  </button>
                </div>

                {showReports && (
                  <div className="mb-6">
                    <EquipmentReportGenerator equipments={filteredEquipments} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEquipments.map((equipment) => (
                    <EquipmentCard
                      key={equipment.id}
                      equipment={equipment}
                      onEdit={() => {
                        setSelectedEquipment(equipment);
                        setIsEditFormOpen(true);
                      }}
                      onDelete={() => handleDeleteEquipment(equipment.id)}
                    />
                  ))}
                </div>
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrinterList />
                <PrinterMonitor printerId="1" />
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrinterQueue />
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrinterStats />
              </motion.div>
            </Tab.Panel>

            <Tab.Panel>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PrinterConfig printerId="1" />
              </motion.div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
