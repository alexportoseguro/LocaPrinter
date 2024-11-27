import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'

type Notification = Database['public']['Tables']['notifications']['Row']

interface NotificationTemplate {
  title: string
  body: string
  data?: Record<string, any>
}

class NotificationService {
  // Enviar notificação
  async sendNotification(
    userId: string,
    type: string,
    template: NotificationTemplate,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) {
    try {
      const notification = {
        user_id: userId,
        type,
        title: template.title,
        body: template.body,
        data: template.data,
        priority,
        read: false,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single()

      if (error) throw error

      // Enviar notificação em tempo real via Supabase
      await supabase
        .channel('notifications')
        .send({
          type: 'broadcast',
          event: 'new_notification',
          payload: data
        })

      return data
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      throw error
    }
  }

  // Buscar notificações do usuário
  async getUserNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean
      limit?: number
      offset?: number
    }
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (options?.unreadOnly) {
        query = query.eq('read', false)
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        )
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
      return []
    }
  }

  // Marcar notificação como lida
  async markAsRead(notificationId: number) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
      throw error
    }
  }

  // Marcar todas as notificações como lidas
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error)
      throw error
    }
  }

  // Excluir notificação
  async deleteNotification(notificationId: number) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao excluir notificação:', error)
      throw error
    }
  }

  // Limpar notificações antigas
  async clearOldNotifications(userId: string, daysOld: number) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', cutoffDate.toISOString())

      if (error) throw error
    } catch (error) {
      console.error('Erro ao limpar notificações antigas:', error)
      throw error
    }
  }

  // Configurar preferências de notificação
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      email?: boolean
      push?: boolean
      sms?: boolean
      types?: string[] // Tipos de notificação que o usuário deseja receber
    }
  ) {
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          email_enabled: preferences.email,
          push_enabled: preferences.push,
          sms_enabled: preferences.sms,
          notification_types: preferences.types,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar preferências de notificação:', error)
      throw error
    }
  }

  // Buscar preferências de notificação
  async getNotificationPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar preferências de notificação:', error)
      throw error
    }
  }

  // Templates de notificação
  getNotificationTemplate(
    type: string,
    data: Record<string, any>
  ): NotificationTemplate {
    switch (type) {
      case 'print_job_completed':
        return {
          title: 'Impressão Concluída',
          body: `Seu trabalho de impressão "${data.jobName}" foi concluído com sucesso.`,
          data
        }

      case 'scan_job_completed':
        return {
          title: 'Digitalização Concluída',
          body: `Seu trabalho de digitalização "${data.jobName}" foi concluído com sucesso.`,
          data
        }

      case 'low_supplies':
        return {
          title: 'Suprimentos Baixos',
          body: `O equipamento ${data.equipmentName} está com níveis baixos de ${data.supplyType}.`,
          data
        }

      case 'maintenance_required':
        return {
          title: 'Manutenção Necessária',
          body: `O equipamento ${data.equipmentName} requer manutenção: ${data.maintenanceType}.`,
          data
        }

      case 'error_alert':
        return {
          title: 'Erro no Equipamento',
          body: `Erro detectado no equipamento ${data.equipmentName}: ${data.errorMessage}.`,
          data
        }

      case 'cost_alert':
        return {
          title: 'Alerta de Custo',
          body: `O departamento ${data.department} atingiu ${data.percentage}% do orçamento mensal de impressão.`,
          data
        }

      case 'sustainability_achievement':
        return {
          title: 'Meta de Sustentabilidade',
          body: `Parabéns! Você economizou ${data.paperSaved} folhas este mês, reduzindo ${data.carbonSaved}kg de CO2.`,
          data
        }

      default:
        throw new Error(`Template de notificação não encontrado para o tipo: ${type}`)
    }
  }

  // Configurar canais de notificação em tempo real
  setupRealtimeNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()
  }
}

export const notificationService = new NotificationService()
