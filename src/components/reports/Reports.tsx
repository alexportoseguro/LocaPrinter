import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { motion } from 'framer-motion'
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { reportingService } from '../../services/reportingService'
import { notificationService } from '../../services/notificationService'

interface Report {
  id: number
  type: string
  start_date: string
  end_date: string
  metrics: {
    printVolume: number
    scanVolume: number
    costs: number
    savings: number
    sustainability: {
      paperSaved: number
      carbonFootprint: number
      energyEfficiency: number
    }
  }
  insights: {
    trends: string[]
    recommendations: string[]
    risks: string[]
    opportunities: string[]
  }
  created_at: string
}

const Reports: React.FC = () => {
  const theme = useTheme()
  const [reports, setReports] = useState<Report[]>([])
  const [openNewReport, setOpenNewReport] = useState(false)
  const [openScheduleReport, setOpenScheduleReport] = useState(false)
  const [newReportData, setNewReportData] = useState({
    type: 'monthly',
    startDate: new Date(),
    endDate: new Date()
  })
  const [scheduleData, setScheduleData] = useState({
    type: 'monthly',
    dayOfMonth: '1',
    time: '08:00'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 6) // Últimos 6 meses

      const response = await reportingService.getReports(
        'current-org',
        startDate,
        endDate
      )
      setReports(response)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar relatórios:', err)
      setError('Erro ao carregar relatórios')
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      const report = await reportingService.generateReport(
        'current-org',
        newReportData.startDate,
        newReportData.endDate,
        newReportData.type as any
      )

      setReports([report, ...reports])
      setOpenNewReport(false)

      // Enviar notificação
      await notificationService.sendNotification(
        'current-user',
        'report_generated',
        {
          title: 'Relatório Gerado',
          body: `Seu relatório ${report.type} foi gerado com sucesso.`
        }
      )
    } catch (err) {
      console.error('Erro ao gerar relatório:', err)
      setError('Erro ao gerar relatório')
    }
  }

  const handleScheduleReport = async () => {
    try {
      await reportingService.scheduleReport(
        'current-org',
        {
          type: scheduleData.type as any,
          dayOfMonth: parseInt(scheduleData.dayOfMonth),
          time: scheduleData.time
        }
      )

      setOpenScheduleReport(false)

      // Enviar notificação
      await notificationService.sendNotification(
        'current-user',
        'report_scheduled',
        {
          title: 'Relatório Agendado',
          body: `Seu relatório ${scheduleData.type} foi agendado com sucesso.`
        }
      )
    } catch (err) {
      console.error('Erro ao agendar relatório:', err)
      setError('Erro ao agendar relatório')
    }
  }

  const handleExportReport = async (reportId: number, format: 'pdf' | 'excel' | 'csv') => {
    try {
      await reportingService.exportReport(reportId, format)

      // Enviar notificação
      await notificationService.sendNotification(
        'current-user',
        'report_exported',
        {
          title: 'Relatório Exportado',
          body: `Seu relatório foi exportado com sucesso no formato ${format.toUpperCase()}.`
        }
      )
    } catch (err) {
      console.error('Erro ao exportar relatório:', err)
      setError('Erro ao exportar relatório')
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                Relatórios
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenNewReport(true)}
                  sx={{ mr: 1 }}
                >
                  Novo Relatório
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  onClick={() => setOpenScheduleReport(true)}
                >
                  Agendar
                </Button>
              </Box>
            </Box>

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
          </Grid>

          {/* Lista de Relatórios */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell>Volume Total</TableCell>
                    <TableCell>Economia</TableCell>
                    <TableCell>Sustentabilidade</TableCell>
                    <TableCell>Data de Criação</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map(report => (
                    <TableRow
                      key={report.id}
                      component={motion.tr}
                      whileHover={{ backgroundColor: theme.palette.action.hover }}
                    >
                      <TableCell>{report.type}</TableCell>
                      <TableCell>
                        {new Date(report.start_date).toLocaleDateString()} -
                        {new Date(report.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {report.metrics.printVolume + report.metrics.scanVolume}
                      </TableCell>
                      <TableCell>
                        R$ {report.metrics.savings.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {report.metrics.sustainability.paperSaved} folhas
                      </TableCell>
                      <TableCell>
                        {new Date(report.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Exportar PDF">
                          <IconButton
                            onClick={() => handleExportReport(report.id, 'pdf')}
                            size="small"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Exportar Excel">
                          <IconButton
                            onClick={() => handleExportReport(report.id, 'excel')}
                            size="small"
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </motion.div>

      {/* Dialog para Novo Relatório */}
      <Dialog
        open={openNewReport}
        onClose={() => setOpenNewReport(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Gerar Novo Relatório</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Tipo de Relatório"
            fullWidth
            value={newReportData.type}
            onChange={(e) =>
              setNewReportData({ ...newReportData, type: e.target.value })
            }
          >
            <MenuItem value="daily">Diário</MenuItem>
            <MenuItem value="weekly">Semanal</MenuItem>
            <MenuItem value="monthly">Mensal</MenuItem>
            <MenuItem value="quarterly">Trimestral</MenuItem>
            <MenuItem value="annual">Anual</MenuItem>
          </TextField>

          <DatePicker
            label="Data Inicial"
            value={newReportData.startDate}
            onChange={(date) =>
              setNewReportData({ ...newReportData, startDate: date || new Date() })
            }
          />

          <DatePicker
            label="Data Final"
            value={newReportData.endDate}
            onChange={(date) =>
              setNewReportData({ ...newReportData, endDate: date || new Date() })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewReport(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Gerar Relatório
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Agendar Relatório */}
      <Dialog
        open={openScheduleReport}
        onClose={() => setOpenScheduleReport(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Agendar Relatório</DialogTitle>
        <DialogContent>
          <TextField
            select
            margin="dense"
            label="Frequência"
            fullWidth
            value={scheduleData.type}
            onChange={(e) =>
              setScheduleData({ ...scheduleData, type: e.target.value })
            }
          >
            <MenuItem value="daily">Diário</MenuItem>
            <MenuItem value="weekly">Semanal</MenuItem>
            <MenuItem value="monthly">Mensal</MenuItem>
          </TextField>

          {scheduleData.type === 'monthly' && (
            <TextField
              margin="dense"
              label="Dia do Mês"
              type="number"
              fullWidth
              value={scheduleData.dayOfMonth}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, dayOfMonth: e.target.value })
              }
              inputProps={{ min: 1, max: 31 }}
            />
          )}

          <TextField
            margin="dense"
            label="Horário"
            type="time"
            fullWidth
            value={scheduleData.time}
            onChange={(e) =>
              setScheduleData({ ...scheduleData, time: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenScheduleReport(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleScheduleReport}
            variant="contained"
            startIcon={<ScheduleIcon />}
          >
            Agendar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Reports
