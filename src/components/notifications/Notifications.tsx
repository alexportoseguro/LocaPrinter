import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Tooltip,
  Button
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { notificationService } from '../../services/notificationService'

interface Notification {
  id: number
  title: string
  body: string
  type: string
  priority: 'low' | 'medium' | 'high'
  read: boolean
  created_at: string
  data?: Record<string, any>
}

const Notifications: React.FC = () => {
  const theme = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
    setupRealtimeNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationService.getUserNotifications('current-user', {
        limit: 50
      })
      setNotifications(response)
      setUnreadCount(response.filter(n => !n.read).length)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar notificações:', err)
      setError('Erro ao carregar notificações')
      setLoading(false)
    }
  }

  const setupRealtimeNotifications = () => {
    const subscription = notificationService.setupRealtimeNotifications(
      'current-user',
      (notification) => {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null)
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ))
      setUnreadCount(prev => prev - 1)
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead('current-user')
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Erro ao marcar todas notificações como lidas:', err)
    }
  }

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId)
      setNotifications(notifications.filter(n => n.id !== notificationId))
      if (!notifications.find(n => n.id === notificationId)?.read) {
        setUnreadCount(prev => prev - 1)
      }
    } catch (err) {
      console.error('Erro ao excluir notificação:', err)
    }
  }

  const handleClearOldNotifications = async () => {
    try {
      await notificationService.clearOldNotifications('current-user', 30) // Limpar notificações com mais de 30 dias
      fetchNotifications() // Recarregar lista
    } catch (err) {
      console.error('Erro ao limpar notificações antigas:', err)
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    switch (priority) {
      case 'high':
        return <ErrorIcon color="error" />
      case 'medium':
        return <WarningIcon color="warning" />
      default:
        return <InfoIcon color="info" />
    }
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' anos atrás'
    
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' meses atrás'
    
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' dias atrás'
    
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' horas atrás'
    
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutos atrás'
    
    return Math.floor(seconds) + ' segundos atrás'
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleNotificationClick}
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 500,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Notificações
          </Typography>
          <Box>
            <Tooltip title="Configurações">
              <IconButton size="small" onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            {unreadCount > 0 && (
              <Tooltip title="Marcar todas como lidas">
                <IconButton size="small" onClick={handleMarkAllAsRead} sx={{ ml: 1 }}>
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider />

        <AnimatePresence>
          {notifications.length > 0 ? (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <ListItem
                    sx={{
                      bgcolor: notification.read
                        ? 'transparent'
                        : theme.palette.action.hover
                    }}
                  >
                    <Box sx={{ mr: 2 }}>
                      {getNotificationIcon(notification.type, notification.priority)}
                    </Box>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notification.body}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {getTimeAgo(notification.created_at)}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      {!notification.read && (
                        <Tooltip title="Marcar como lida">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Excluir">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </motion.div>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Nenhuma notificação
              </Typography>
            </Box>
          )}
        </AnimatePresence>
      </Menu>

      {/* Menu de Configurações */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 200
          }
        }}
      >
        <MenuItem onClick={handleClearOldNotifications}>
          Limpar Notificações Antigas
        </MenuItem>
        <MenuItem onClick={handleSettingsClose}>
          Configurar Preferências
        </MenuItem>
      </Menu>
    </>
  )
}

export default Notifications
