import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { documentService } from '../../services/documentService'
import { financialAnalysisService } from '../../services/financialAnalysisService'
import { sustainabilityService } from '../../services/sustainabilityService'
import { monitoringService } from '../../services/monitoringService'
import { predictionService } from '../../services/predictionService'

interface DashboardMetrics {
  printVolume: number
  scanVolume: number
  costs: number
  savings: number
  sustainability: {
    paperSaved: number
    carbonFootprint: number
    energyEfficiency: number
  }
  equipment: {
    total: number
    active: number
    maintenance: number
    error: number
  }
  predictions: {
    maintenanceRisk: number
    costProjection: number
    sustainabilityScore: number
  }
}

const Dashboard: React.FC = () => {
  const theme = useTheme()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cores para gráficos
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Definir período (último mês)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)

      // Buscar dados de diferentes serviços em paralelo
      const [
        documentStats,
        financialStats,
        sustainabilityStats,
        equipmentStats,
        predictions
      ] = await Promise.all([
        documentService.getDocumentStats('current-org', startDate, endDate),
        financialAnalysisService.getFinancialMetrics('current-org', startDate, endDate),
        sustainabilityService.getSustainabilityMetrics('current-org', startDate, endDate),
        monitoringService.getEquipmentStats('current-org'),
        predictionService.getPredictions('current-org')
      ])

      setMetrics({
        printVolume: documentStats.totalPrints,
        scanVolume: documentStats.totalScans,
        costs: financialStats.totalCosts,
        savings: financialStats.totalSavings,
        sustainability: {
          paperSaved: sustainabilityStats.paperSaved,
          carbonFootprint: sustainabilityStats.carbonFootprint,
          energyEfficiency: sustainabilityStats.energyEfficiency
        },
        equipment: {
          total: equipmentStats.total,
          active: equipmentStats.active,
          maintenance: equipmentStats.maintenance,
          error: equipmentStats.error
        },
        predictions: {
          maintenanceRisk: predictions.maintenanceRisk,
          costProjection: predictions.costProjection,
          sustainabilityScore: predictions.sustainabilityScore
        }
      })

      setLoading(false)
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
      setLoading(false)
    }
  }

  // Dados para o gráfico de volume de impressão/digitalização
  const volumeData = [
    {
      name: 'Impressões',
      value: metrics?.printVolume || 0
    },
    {
      name: 'Digitalizações',
      value: metrics?.scanVolume || 0
    }
  ]

  // Dados para o gráfico de custos/economia
  const financialData = [
    {
      name: 'Custos',
      value: metrics?.costs || 0
    },
    {
      name: 'Economia',
      value: metrics?.savings || 0
    }
  ]

  // Dados para o gráfico de equipamentos
  const equipmentData = [
    {
      name: 'Ativos',
      value: metrics?.equipment.active || 0,
      color: colors.success
    },
    {
      name: 'Manutenção',
      value: metrics?.equipment.maintenance || 0,
      color: colors.warning
    },
    {
      name: 'Erro',
      value: metrics?.equipment.error || 0,
      color: colors.error
    }
  ]

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {error && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.contrastText
            }}
          >
            {error}
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* Métricas principais */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140
              }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <Typography variant="h6" gutterBottom>
                Volume Total
              </Typography>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                {metrics?.printVolume + (metrics?.scanVolume || 0)}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                páginas processadas
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140
              }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <Typography variant="h6" gutterBottom>
                Economia Total
              </Typography>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                R$ {metrics?.savings.toFixed(2)}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                no último mês
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140
              }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <Typography variant="h6" gutterBottom>
                Papel Economizado
              </Typography>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                {metrics?.sustainability.paperSaved}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                folhas
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 140
              }}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
            >
              <Typography variant="h6" gutterBottom>
                Equipamentos Ativos
              </Typography>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                {metrics?.equipment.active}/{metrics?.equipment.total}
              </Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                em operação
              </Typography>
            </Paper>
          </Grid>

          {/* Gráficos */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Volume de Processamento
              </Typography>
              <BarChart width={500} height={300} data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={colors.primary} />
              </BarChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Análise Financeira
              </Typography>
              <LineChart width={500} height={300} data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.secondary}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Status dos Equipamentos
              </Typography>
              <PieChart width={500} height={300}>
                <Pie
                  data={equipmentData}
                  cx={200}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {equipmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Previsões e Tendências
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Risco de Manutenção: {metrics?.predictions.maintenanceRisk}%
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Projeção de Custos: R$ {metrics?.predictions.costProjection.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Score de Sustentabilidade: {metrics?.predictions.sustainabilityScore}/100
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  )
}

export default Dashboard
