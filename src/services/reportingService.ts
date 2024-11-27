import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'
import OpenAI from 'openai'
import { documentService } from './documentService'
import { financialAnalysisService } from './financialAnalysisService'
import { sustainabilityService } from './sustainabilityService'

type Report = Database['public']['Tables']['reports']['Row']

interface ReportMetrics {
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

interface ReportInsights {
  trends: string[]
  recommendations: string[]
  risks: string[]
  opportunities: string[]
}

class ReportingService {
  private openai: OpenAI

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }

  // Gerar relatório completo
  async generateReport(
    organizationId: string,
    startDate: Date,
    endDate: Date,
    reportType: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  ): Promise<Report> {
    try {
      // Coletar métricas
      const metrics = await this.collectMetrics(organizationId, startDate, endDate)
      
      // Gerar insights usando IA
      const insights = await this.generateInsights(metrics, reportType)

      // Criar relatório
      const report = {
        organization_id: organizationId,
        type: reportType,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        metrics,
        insights,
        created_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('reports')
        .insert(report)
        .select()
        .single()

      if (error) throw error

      // Gerar documento PDF do relatório
      await this.generateReportDocument(data)

      return data
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      throw error
    }
  }

  // Coletar métricas para o relatório
  private async collectMetrics(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReportMetrics> {
    try {
      // Buscar dados de diferentes serviços em paralelo
      const [
        documentStats,
        financialStats,
        sustainabilityStats
      ] = await Promise.all([
        documentService.getDocumentStats(organizationId, startDate, endDate),
        financialAnalysisService.getFinancialMetrics(organizationId, startDate, endDate),
        sustainabilityService.getSustainabilityMetrics(organizationId, startDate, endDate)
      ])

      return {
        printVolume: documentStats.totalPrints,
        scanVolume: documentStats.totalScans,
        costs: financialStats.totalCosts,
        savings: financialStats.totalSavings,
        sustainability: {
          paperSaved: sustainabilityStats.paperSaved,
          carbonFootprint: sustainabilityStats.carbonFootprint,
          energyEfficiency: sustainabilityStats.energyEfficiency
        }
      }
    } catch (error) {
      console.error('Erro ao coletar métricas:', error)
      throw error
    }
  }

  // Gerar insights usando IA
  private async generateInsights(
    metrics: ReportMetrics,
    reportType: string
  ): Promise<ReportInsights> {
    try {
      const prompt = `
        Analise as seguintes métricas de uma organização e gere insights estratégicos:
        
        Período: ${reportType}
        Volume de Impressão: ${metrics.printVolume}
        Volume de Digitalização: ${metrics.scanVolume}
        Custos: ${metrics.costs}
        Economia: ${metrics.savings}
        
        Sustentabilidade:
        - Papel economizado: ${metrics.sustainability.paperSaved}
        - Pegada de carbono: ${metrics.sustainability.carbonFootprint}
        - Eficiência energética: ${metrics.sustainability.energyEfficiency}
        
        Forneça uma análise em formato JSON com:
        - trends: tendências identificadas
        - recommendations: recomendações de melhoria
        - risks: riscos potenciais
        - opportunities: oportunidades de otimização
      `

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em análise de dados e otimização de processos de impressão e digitalização."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })

      return JSON.parse(response.choices[0].message.content) as ReportInsights
    } catch (error) {
      console.error('Erro ao gerar insights:', error)
      throw error
    }
  }

  // Gerar documento PDF do relatório
  private async generateReportDocument(report: Report) {
    try {
      // Gerar conteúdo do relatório em HTML
      const htmlContent = await this.generateReportHtml(report)

      // Criar documento no sistema
      await documentService.createDocument({
        name: `Relatório ${report.type} - ${report.start_date}`,
        type: 'report',
        content: htmlContent,
        organization_id: report.organization_id,
        metadata: {
          report_id: report.id,
          report_type: report.type,
          period: {
            start: report.start_date,
            end: report.end_date
          }
        }
      })
    } catch (error) {
      console.error('Erro ao gerar documento do relatório:', error)
      throw error
    }
  }

  // Gerar HTML do relatório
  private async generateReportHtml(report: Report): Promise<string> {
    const metrics = report.metrics as ReportMetrics
    const insights = report.insights as ReportInsights

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório ${report.type} - ${report.start_date}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            
            h1, h2 {
              color: #2c3e50;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            
            .metric-card {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .sustainability-section {
              background: #e8f5e9;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            
            .insights-section {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin: 20px 0;
            }
            
            ul {
              list-style-type: none;
              padding-left: 0;
            }
            
            li {
              margin-bottom: 10px;
              padding-left: 20px;
              position: relative;
            }
            
            li:before {
              content: "•";
              color: #2c3e50;
              position: absolute;
              left: 0;
            }
          </style>
        </head>
        <body>
          <h1>Relatório ${report.type}</h1>
          <p>Período: ${report.start_date} a ${report.end_date}</p>
          
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Volume de Impressão</h3>
              <p>${metrics.printVolume} páginas</p>
            </div>
            
            <div class="metric-card">
              <h3>Volume de Digitalização</h3>
              <p>${metrics.scanVolume} páginas</p>
            </div>
            
            <div class="metric-card">
              <h3>Custos</h3>
              <p>R$ ${metrics.costs.toFixed(2)}</p>
            </div>
            
            <div class="metric-card">
              <h3>Economia</h3>
              <p>R$ ${metrics.savings.toFixed(2)}</p>
            </div>
          </div>
          
          <div class="sustainability-section">
            <h2>Métricas de Sustentabilidade</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <h3>Papel Economizado</h3>
                <p>${metrics.sustainability.paperSaved} folhas</p>
              </div>
              
              <div class="metric-card">
                <h3>Pegada de Carbono</h3>
                <p>${metrics.sustainability.carbonFootprint} kg CO2</p>
              </div>
              
              <div class="metric-card">
                <h3>Eficiência Energética</h3>
                <p>${metrics.sustainability.energyEfficiency}%</p>
              </div>
            </div>
          </div>
          
          <div class="insights-section">
            <h2>Insights e Recomendações</h2>
            
            <h3>Tendências Identificadas</h3>
            <ul>
              ${insights.trends.map(trend => `<li>${trend}</li>`).join('')}
            </ul>
            
            <h3>Recomendações</h3>
            <ul>
              ${insights.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
            
            <h3>Riscos Potenciais</h3>
            <ul>
              ${insights.risks.map(risk => `<li>${risk}</li>`).join('')}
            </ul>
            
            <h3>Oportunidades</h3>
            <ul>
              ${insights.opportunities.map(opp => `<li>${opp}</li>`).join('')}
            </ul>
          </div>
        </body>
      </html>
    `
  }

  // Buscar relatórios por período
  async getReports(
    organizationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('organization_id', organizationId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error)
      return []
    }
  }

  // Exportar relatório em diferentes formatos
  async exportReport(reportId: number, format: 'pdf' | 'excel' | 'csv') {
    try {
      const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single()

      if (error) throw error

      switch (format) {
        case 'pdf':
          return await this.generateReportDocument(report)
        case 'excel':
          return await this.exportToExcel(report)
        case 'csv':
          return await this.exportToCsv(report)
        default:
          throw new Error('Formato de exportação não suportado')
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error)
      throw error
    }
  }

  // Exportar para Excel
  private async exportToExcel(report: Report) {
    // Implementar exportação para Excel
    throw new Error('Exportação para Excel ainda não implementada')
  }

  // Exportar para CSV
  private async exportToCsv(report: Report) {
    // Implementar exportação para CSV
    throw new Error('Exportação para CSV ainda não implementada')
  }

  // Agendar relatórios automáticos
  async scheduleReport(
    organizationId: string,
    schedule: {
      type: 'daily' | 'weekly' | 'monthly'
      dayOfWeek?: number // 0-6 para relatórios semanais
      dayOfMonth?: number // 1-31 para relatórios mensais
      time: string // HH:mm
    }
  ) {
    try {
      const { error } = await supabase
        .from('report_schedules')
        .insert({
          organization_id: organizationId,
          schedule_type: schedule.type,
          day_of_week: schedule.dayOfWeek,
          day_of_month: schedule.dayOfMonth,
          time: schedule.time,
          created_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao agendar relatório:', error)
      throw error
    }
  }
}

export const reportingService = new ReportingService(process.env.OPENAI_API_KEY || '')
