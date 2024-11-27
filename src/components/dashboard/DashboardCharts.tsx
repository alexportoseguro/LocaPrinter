import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'framer-motion';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function DashboardCharts() {
  // Dados simulados para o gráfico
  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  
  const equipmentData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Equipamentos Ativos',
        data: [65, 70, 75, 78, 82, 85],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const maintenanceData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Manutenções Realizadas',
        data: [12, 15, 10, 18, 14, 16],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold mb-4">Evolução de Equipamentos</h3>
        <Line data={equipmentData} options={chartOptions} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <h3 className="text-lg font-semibold mb-4">Manutenções por Mês</h3>
        <Line data={maintenanceData} options={chartOptions} />
      </motion.div>
    </div>
  );
}
