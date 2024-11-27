import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CounterReportUpload } from './CounterReportUpload';
import { CounterReportList } from './CounterReportList';

export function CounterReportManager() {
  const [currentView, setCurrentView] = useState<'list' | 'upload'>('list');

  return (
    <div className="container mx-auto px-4">
      {/* Navegação */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setCurrentView('list')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'list'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Relatórios
        </button>
        <button
          onClick={() => setCurrentView('upload')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentView === 'upload'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Novo Relatório
        </button>
      </div>

      {/* Conteúdo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === 'list' ? <CounterReportList /> : <CounterReportUpload />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
