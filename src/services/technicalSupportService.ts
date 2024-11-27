import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'
import OpenAI from 'openai'

type SupportTicket = Database['public']['Tables']['support_tickets']['Row']
type Equipment = Database['public']['Tables']['equipment']['Row']

interface TicketPriority {
  level: 'low' | 'medium' | 'high' | 'critical'
  score: number
  reason: string
}

interface TroubleshootingStep {
  step: number
  instruction: string
  expectedOutcome: string
  completed: boolean
}

class TechnicalSupportService {
  private openai: OpenAI

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }

  // Criar ticket de suporte
  async createSupportTicket(ticket: Omit<SupportTicket, 'id' | 'created_at' | 'priority_level'>) {
    try {
      // Analisar a descrição do problema e definir prioridade
      const priority = await this.analyzeProblemPriority(ticket.description)
      
      const ticketWithPriority = {
        ...ticket,
        priority_level: priority.level
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .insert(ticketWithPriority)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar ticket de suporte:', error)
      throw error
    }
  }

  // Analisar prioridade do problema usando IA
  private async analyzeProblemPriority(description: string): Promise<TicketPriority> {
    try {
      const prompt = `
        Analise a seguinte descrição de problema de impressora e determine sua prioridade:
        "${description}"
        
        Responda em formato JSON com:
        - level: "low", "medium", "high" ou "critical"
        - score: número de 0 a 100
        - reason: explicação da prioridade atribuída
      `

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em suporte técnico de impressoras. Analise problemas e determine sua prioridade baseado na urgência e impacto no negócio."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return JSON.parse(response.choices[0].message.content) as TicketPriority
    } catch (error) {
      console.error('Erro ao analisar prioridade:', error)
      return {
        level: 'medium',
        score: 50,
        reason: 'Erro na análise automática de prioridade'
      }
    }
  }

  // Gerar passos de troubleshooting usando IA
  async generateTroubleshootingSteps(
    ticketId: number,
    equipmentId: number
  ): Promise<TroubleshootingStep[]> {
    try {
      // Buscar informações do ticket e equipamento
      const [ticketData, equipmentData] = await Promise.all([
        supabase
          .from('support_tickets')
          .select('*')
          .eq('id', ticketId)
          .single(),
        supabase
          .from('equipment')
          .select('*')
          .eq('id', equipmentId)
          .single()
      ])

      if (ticketData.error) throw ticketData.error
      if (equipmentData.error) throw equipmentData.error

      const ticket = ticketData.data
      const equipment = equipmentData.data

      const prompt = `
        Gere passos de troubleshooting para o seguinte problema:
        
        Problema: ${ticket.description}
        Equipamento: ${equipment.model}
        Status atual: ${equipment.status}
        Histórico de problemas: ${equipment.maintenance_history}
        
        Forneça uma lista de passos em formato JSON com:
        - step: número do passo
        - instruction: instrução clara do que fazer
        - expectedOutcome: resultado esperado
        - completed: false
      `

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em manutenção de impressoras. Forneça instruções claras e práticas para resolução de problemas."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return JSON.parse(response.choices[0].message.content) as TroubleshootingStep[]
    } catch (error) {
      console.error('Erro ao gerar passos de troubleshooting:', error)
      throw error
    }
  }

  // Atualizar status do ticket
  async updateTicketStatus(
    ticketId: number,
    status: string,
    resolution?: string
  ) {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status,
          resolution,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', ticketId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar status do ticket:', error)
      throw error
    }
  }

  // Buscar histórico de tickets por equipamento
  async getEquipmentTicketHistory(equipmentId: number): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('equipment_id', equipmentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar histórico de tickets:', error)
      return []
    }
  }

  // Análise preditiva de problemas
  async analyzePotentialIssues(equipmentId: number) {
    try {
      // Buscar dados do equipamento e histórico
      const [equipment, tickets] = await Promise.all([
        supabase
          .from('equipment')
          .select('*')
          .eq('id', equipmentId)
          .single(),
        this.getEquipmentTicketHistory(equipmentId)
      ])

      if (equipment.error) throw equipment.error

      const prompt = `
        Analise os seguintes dados de uma impressora e identifique possíveis problemas futuros:
        
        Modelo: ${equipment.data.model}
        Idade: ${equipment.data.age_months} meses
        Status: ${equipment.data.status}
        Uso médio mensal: ${equipment.data.average_monthly_usage} páginas
        Histórico de manutenção: ${equipment.data.maintenance_history}
        
        Histórico de tickets:
        ${tickets.map(t => `- ${t.created_at}: ${t.description} (${t.status})`).join('\n')}
        
        Forneça uma análise em formato JSON com:
        - potentialIssues: array de possíveis problemas
        - recommendations: array de recomendações preventivas
        - riskLevel: "low", "medium" ou "high"
      `

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise preditiva de equipamentos de impressão. Use os dados históricos para prever possíveis problemas futuros."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return JSON.parse(response.choices[0].message.content)
    } catch (error) {
      console.error('Erro na análise preditiva:', error)
      throw error
    }
  }

  // Feedback e avaliação do suporte
  async submitSupportFeedback(
    ticketId: number,
    rating: number,
    comment: string
  ) {
    try {
      const { error } = await supabase
        .from('support_feedback')
        .insert({
          ticket_id: ticketId,
          rating,
          comment,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // Analisar feedback para melhorias
      await this.analyzeFeedbackForImprovements(rating, comment)
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
      throw error
    }
  }

  // Análise de feedback para melhorias
  private async analyzeFeedbackForImprovements(rating: number, comment: string) {
    try {
      const prompt = `
        Analise o seguinte feedback de suporte técnico:
        
        Avaliação: ${rating}/5
        Comentário: "${comment}"
        
        Identifique:
        1. Pontos positivos
        2. Áreas de melhoria
        3. Ações recomendadas
        
        Responda em formato JSON.
      `

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de satisfação do cliente e melhoria de processos de suporte técnico."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

      const analysis = JSON.parse(response.choices[0].message.content)

      // Armazenar análise para relatórios de melhoria
      await supabase
        .from('feedback_analysis')
        .insert({
          rating,
          comment,
          analysis,
          created_at: new Date().toISOString()
        })

    } catch (error) {
      console.error('Erro ao analisar feedback:', error)
    }
  }
}

export const technicalSupportService = new TechnicalSupportService(process.env.OPENAI_API_KEY || '')
