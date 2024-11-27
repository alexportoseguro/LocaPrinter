import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Description as DocumentIcon,
  ColorLens as ColorIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PrinterStatsProps {
  printerId: string;
}

interface UsageData {
  date: string;
  pages: number;
  colorPages: number;
  jobs: number;
}

interface PrinterMetrics {
  totalPages: number;
  colorPages: number;
  totalJobs: number;
  averagePagesPerJob: number;
  colorPercentage: number;
  paperSaved: number;
  costSaved: number;
}

const PrinterStats: React.FC<PrinterStatsProps> = ({ printerId }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [metrics, setMetrics] = useState<PrinterMetrics>({
    totalPages: 0,
    colorPages: 0,
    totalJobs: 0,
    averagePagesPerJob: 0,
    colorPercentage: 0,
    paperSaved: 0,
    costSaved: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulação de dados - substituir por chamada real à API
      const data = generateMockData(timeRange);
      setUsageData(data);
      calculateMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, printerId]);

  const calculateMetrics = (data: UsageData[]) => {
    const totalPages = data.reduce((sum, day) => sum + day.pages, 0);
    const colorPages = data.reduce((sum, day) => sum + day.colorPages, 0);
    const totalJobs = data.reduce((sum, day) => sum + day.jobs, 0);

    setMetrics({
      totalPages,
      colorPages,
      totalJobs,
      averagePagesPerJob: totalJobs ? totalPages / totalJobs : 0,
      colorPercentage: totalPages ? (colorPages / totalPages) * 100 : 0,
      paperSaved: Math.floor(totalPages * 0.3), // Simulação de economia de papel
      costSaved: totalPages * 0.05, // Simulação de economia de custo
    });
  };

  const generateMockData = (range: string): UsageData[] => {
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        pages: Math.floor(Math.random() * 100) + 20,
        colorPages: Math.floor(Math.random() * 50),
        jobs: Math.floor(Math.random() * 10) + 1,
      };
    });
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box sx={{ color }}>{icon}</Box>
          <Typography variant="h6" component="h3" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="p">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" component="h2">
            Estatísticas de Uso
          </Typography>
          <Box display="flex" alignItems="center">
            <FormControl size="small" sx={{ mr: 2 }}>
              <InputLabel>Período</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Período"
              >
                <MenuItem value="week">Última Semana</MenuItem>
                <MenuItem value="month">Último Mês</MenuItem>
                <MenuItem value="quarter">Último Trimestre</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Atualizar">
              <IconButton onClick={fetchData} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total de Páginas"
              value={metrics.totalPages.toLocaleString()}
              icon={<DocumentIcon />}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Páginas Coloridas"
              value={`${metrics.colorPercentage.toFixed(1)}%`}
              icon={<ColorIcon />}
              color="#f50057"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Papel Economizado"
              value={`${metrics.paperSaved} folhas`}
              icon={<SaveIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Custo Economizado"
              value={`R$ ${metrics.costSaved.toFixed(2)}`}
              icon={<TrendingUpIcon />}
              color="#ff9800"
            />
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              Volume de Impressão
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pages"
                    name="Total de Páginas"
                    stroke="#2196f3"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="colorPages"
                    name="Páginas Coloridas"
                    stroke="#f50057"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};

export { PrinterStats };
export default PrinterStats;
