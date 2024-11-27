import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CounterReport {
  id: string;
  equipmentId: string;
  equipmentName: string;
  reportDate: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  counterValues?: {
    black?: number;
    color?: number;
    copies?: number;
    scans?: number;
  };
  processedAt?: string;
  notes?: string;
}

// Dados simulados
const mockReports: CounterReport[] = [
  {
    id: '1',
    equipmentId: 'eq1',
    equipmentName: 'Impressora HP M428',
    reportDate: new Date().toISOString(),
    fileUrl: '#',
    status: 'completed',
    counterValues: {
      black: 12500,
      color: 3200,
      copies: 8900,
      scans: 450
    },
    processedAt: new Date().toISOString()
  },
  {
    id: '2',
    equipmentId: 'eq2',
    equipmentName: 'Multifuncional Xerox B215',
    reportDate: new Date().toISOString(),
    fileUrl: '#',
    status: 'pending'
  }
];

export function CounterReportList() {
  const [reports] = useState<CounterReport[]>(mockReports);

  const getStatusBadge = (status: CounterReport['status']) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pendente'
      },
      processing: {
        color: 'bg-blue-100 text-blue-800',
        text: 'Processando'
      },
      completed: {
        color: 'bg-green-100 text-green-800',
        text: 'Concluído'
      },
      error: {
        color: 'bg-red-100 text-red-800',
        text: 'Erro'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Relatórios de Contadores</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Processar Pendentes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data do Relatório
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contadores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {report.equipmentName}
                  </div>
                  <div className="text-sm text-gray-500">ID: {report.equipmentId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(report.reportDate), "dd 'de' MMMM', às' HH:mm", {
                    locale: ptBR
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {report.counterValues ? (
                    <div className="text-sm text-gray-900">
                      <div>Preto: {report.counterValues.black?.toLocaleString()}</div>
                      <div>Cor: {report.counterValues.color?.toLocaleString()}</div>
                      <div>Cópias: {report.counterValues.copies?.toLocaleString()}</div>
                      <div>Digitalizações: {report.counterValues.scans?.toLocaleString()}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Não processado</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    Visualizar
                  </button>
                  {report.status === 'pending' && (
                    <button className="text-green-600 hover:text-green-900">
                      Processar
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
