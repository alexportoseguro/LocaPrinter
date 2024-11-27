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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  useTheme
} from '@mui/material'
import { motion } from 'framer-motion'
import {
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import { technicalSupportService } from '../../services/technicalSupportService'
import { notificationService } from '../../services/notificationService'

interface SupportTicket {
  id: number
  description: string
  status: string
  priority_level: 'low' | 'medium' | 'high' | 'critical'
  equipment_id: number
  created_at: string
  resolved_at?: string
  resolution?: string
}

interface TroubleshootingStep {
  step: number
  instruction: string
  expectedOutcome: string
  completed: boolean
}

const TechnicalSupport: React.FC = () => {
  const theme = useTheme()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [troubleshootingSteps, setTroubleshootingSteps] = useState<TroubleshootingStep[]>([])
  const [openNewTicket, setOpenNewTicket] = useState(false)
  const [newTicketData, setNewTicketData] = useState({
    description: '',
    equipment_id: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await technicalSupportService.getTickets('current-org')
      setTickets(response)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar tickets:', err)
      setError('Erro ao carregar tickets de suporte')
      setLoading(false)
    }
  }

  const handleNewTicket = async () => {
    try {
      const ticket = await technicalSupportService.createSupportTicket({
        description: newTicketData.description,
        equipment_id: parseInt(newTicketData.equipment_id),
        organization_id: 'current-org',
        status: 'open'
      })

      setTickets([ticket, ...tickets])
      setOpenNewTicket(false)
      setNewTicketData({ description: '', equipment_id: '' })

      // Enviar notificação
      await notificationService.sendNotification(
        'current-user',
        'ticket_created',
        {
          title: 'Ticket Criado',
          body: `Seu ticket de suporte #${ticket.id} foi criado com sucesso.`
        }
      )
    } catch (err) {
      console.error('Erro ao criar ticket:', err)
      setError('Erro ao criar ticket de suporte')
    }
  }

  const handleSelectTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    try {
      const steps = await technicalSupportService.generateTroubleshootingSteps(
        ticket.id,
        ticket.equipment_id
      )
      setTroubleshootingSteps(steps)
    } catch (err) {
      console.error('Erro ao gerar passos de troubleshooting:', err)
      setError('Erro ao gerar passos de troubleshooting')
    }
  }

  const handleCompleteStep = async (stepIndex: number) => {
    const updatedSteps = troubleshootingSteps.map((step, index) =>
      index === stepIndex ? { ...step, completed: true } : step
    )
    setTroubleshootingSteps(updatedSteps)

    // Verificar se todos os passos foram concluídos
    if (updatedSteps.every(step => step.completed) && selectedTicket) {
      await technicalSupportService.updateTicketStatus(
        selectedTicket.id,
        'resolved',
        'Todos os passos de troubleshooting foram concluídos com sucesso.'
      )

      // Atualizar lista de tickets
      await fetchTickets()

      // Enviar notificação
      await notificationService.sendNotification(
        'current-user',
        'ticket_resolved',
        {
          title: 'Ticket Resolvido',
          body: `O ticket #${selectedTicket.id} foi resolvido com sucesso.`
        }
      )
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return theme.palette.error.main
      case 'high':
        return theme.palette.warning.main
      case 'medium':
        return theme.palette.info.main
      default:
        return theme.palette.success.main
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
                Suporte Técnico
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenNewTicket(true)}
              >
                Novo Ticket
              </Button>
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

          {/* Lista de Tickets */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tickets Ativos
              </Typography>
              {tickets.map(ticket => (
                <Card
                  key={ticket.id}
                  sx={{ mb: 2 }}
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">
                        Ticket #{ticket.id}
                      </Typography>
                      <Chip
                        label={ticket.priority_level}
                        sx={{
                          bgcolor: getPriorityColor(ticket.priority_level),
                          color: 'white'
                        }}
                      />
                    </Box>
                    <Typography variant="body1" gutterBottom>
                      {ticket.description}
                    </Typography>
                    <Typography color="text.secondary">
                      Status: {ticket.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleSelectTicket(ticket)}
                      disabled={selectedTicket?.id === ticket.id}
                    >
                      Ver Detalhes
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Detalhes do Ticket e Troubleshooting */}
          <Grid item xs={12} md={6}>
            {selectedTicket && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Troubleshooting - Ticket #{selectedTicket.id}
                </Typography>
                <Stepper orientation="vertical">
                  {troubleshootingSteps.map((step, index) => (
                    <Step key={step.step} active={!step.completed}>
                      <StepLabel>
                        <Typography variant="subtitle1">
                          Passo {step.step}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body1" gutterBottom>
                          {step.instruction}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Resultado esperado: {step.expectedOutcome}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleCompleteStep(index)}
                            sx={{ mt: 1, mr: 1 }}
                            startIcon={<CheckIcon />}
                          >
                            Concluir Passo
                          </Button>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            )}
          </Grid>
        </Grid>
      </motion.div>

      {/* Dialog para Novo Ticket */}
      <Dialog
        open={openNewTicket}
        onClose={() => setOpenNewTicket(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Novo Ticket de Suporte</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Descrição do Problema"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newTicketData.description}
            onChange={(e) =>
              setNewTicketData({ ...newTicketData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="ID do Equipamento"
            type="number"
            fullWidth
            value={newTicketData.equipment_id}
            onChange={(e) =>
              setNewTicketData({ ...newTicketData, equipment_id: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTicket(false)} startIcon={<CloseIcon />}>
            Cancelar
          </Button>
          <Button
            onClick={handleNewTicket}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Criar Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TechnicalSupport
