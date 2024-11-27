import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCompany } from '../../contexts/CompanyContext';

interface Stats {
  equipmentCount: number;
  clientCount: number;
  activeContracts: number;
}

export function DashboardStats() {
  const { currentCompany } = useCompany();
  
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['dashboard-stats', currentCompany?.id],
    queryFn: async () => {
      // Aqui você pode substituir com sua chamada API real
      const response = await fetch(`/api/stats/${currentCompany?.id}`);
      return response.json();
    },
    enabled: !!currentCompany?.id,
    // Atualiza a cada 5 minutos
    refetchInterval: 5 * 60 * 1000,
  });

  const statCards = [
    {
      title: 'Total de Equipamentos',
      value: stats?.equipmentCount || 0,
      color: 'from-blue-500 to-blue-600',
      loading: isLoading,
    },
    {
      title: 'Total de Clientes',
      value: stats?.clientCount || 0,
      color: 'from-green-500 to-green-600',
      loading: isLoading,
    },
    {
      title: 'Contratos Ativos',
      value: stats?.activeContracts || 0,
      color: 'from-purple-500 to-purple-600',
      loading: isLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-lg bg-gradient-to-r ${card.color} p-6 text-white shadow-lg`}
        >
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold opacity-90">{card.title}</h3>
            {card.loading ? (
              <div className="h-8 w-24 animate-pulse bg-white/20 rounded mt-2"></div>
            ) : (
              <p className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</p>
            )}
          </div>
          <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-4 translate-y-4">
            <svg
              className="h-24 w-24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
            </svg>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
