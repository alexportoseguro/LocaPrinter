import { supabase } from '../lib/supabase';
import { EquipmentStatus } from './monitoringService';

interface FinancialMetrics {
  costs: {
    maintenance: number;
    supplies: number;
    energy: number;
    labor: number;
    total: number;
  };
  revenue: {
    printing: number;
    scanning: number;
    services: number;
    total: number;
  };
  profitability: {
    grossMargin: number;
    netMargin: number;
    roi: number;
    paybackPeriod: number;
  };
  trends: {
    costTrend: number[];
    revenueTrend: number[];
    profitTrend: number[];
    timestamps: Date[];
  };
  kpis: {
    costPerPage: number;
    revenuePerDevice: number;
    utilizationRate: number;
    customerSatisfaction: number;
  };
}

interface Budget {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  categories: {
    [key: string]: {
      allocated: number;
      spent: number;
      remaining: number;
      forecast: number;
    };
  };
  total: {
    allocated: number;
    spent: number;
    remaining: number;
    forecast: number;
  };
  status: 'active' | 'closed' | 'draft';
  lastUpdated: Date;
}

interface FinancialReport {
  period: {
    start: Date;
    end: Date;
  };
  metrics: FinancialMetrics;
  budget: Budget;
  insights: {
    summary: string;
    recommendations: string[];
    risks: {
      description: string;
      impact: 'high' | 'medium' | 'low';
      mitigation: string;
    }[];
  };
  forecasts: {
    nextMonth: {
      revenue: number;
      costs: number;
      profit: number;
    };
    nextQuarter: {
      revenue: number;
      costs: number;
      profit: number;
    };
    nextYear: {
      revenue: number;
      costs: number;
      profit: number;
    };
  };
}

class FinancialAnalysisService {
  private readonly PROFIT_MARGIN_THRESHOLD = 0.2; // 20% margem mínima
  private readonly COST_INCREASE_ALERT = 0.1; // 10% aumento
  private readonly UTILIZATION_TARGET = 0.7; // 70% utilização alvo

  // Análise financeira principal
  async analyzeFinancials(companyId: string, period: { start: Date; end: Date }): Promise<FinancialReport> {
    const [metrics, budget] = await Promise.all([
      this.calculateFinancialMetrics(companyId, period),
      this.getCurrentBudget(companyId)
    ]);

    const insights = await this.generateInsights(metrics, budget);
    const forecasts = await this.generateForecasts(companyId, metrics);

    return {
      period,
      metrics,
      budget,
      insights,
      forecasts
    };
  }

  // Análise de custos por equipamento
  async analyzeEquipmentCosts(equipmentId: string): Promise<{
    currentCosts: number;
    historicalCosts: number[];
    forecast: number;
    recommendations: string[];
  }> {
    const [current, historical] = await Promise.all([
      this.getCurrentCosts(equipmentId),
      this.getHistoricalCosts(equipmentId)
    ]);

    const forecast = this.forecastCosts(historical);
    const recommendations = this.generateCostRecommendations(current, historical);

    return {
      currentCosts: current,
      historicalCosts: historical,
      forecast,
      recommendations
    };
  }

  // Análise de ROI
  async analyzeROI(equipmentId: string): Promise<{
    roi: number;
    paybackPeriod: number;
    analysis: string;
  }> {
    const [costs, revenue] = await Promise.all([
      this.getTotalCosts(equipmentId),
      this.getTotalRevenue(equipmentId)
    ]);

    const roi = this.calculateROI(costs, revenue);
    const paybackPeriod = this.calculatePaybackPeriod(costs, revenue);
    const analysis = this.generateROIAnalysis(roi, paybackPeriod);

    return { roi, paybackPeriod, analysis };
  }

  // Métodos privados
  private async calculateFinancialMetrics(
    companyId: string,
    period: { start: Date; end: Date }
  ): Promise<FinancialMetrics> {
    const costs = await this.calculateCosts(companyId, period);
    const revenue = await this.calculateRevenue(companyId, period);
    const profitability = this.calculateProfitability(costs, revenue);
    const trends = await this.calculateTrends(companyId, period);
    const kpis = await this.calculateKPIs(companyId, period);

    return {
      costs,
      revenue,
      profitability,
      trends,
      kpis
    };
  }

  private async calculateCosts(companyId: string, period: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('company_id', companyId)
      .eq('type', 'cost')
      .gte('date', period.start.toISOString())
      .lte('date', period.end.toISOString());

    if (error) throw error;

    const costs = {
      maintenance: 0,
      supplies: 0,
      energy: 0,
      labor: 0,
      total: 0
    };

    data.forEach(transaction => {
      costs[transaction.category] += transaction.amount;
      costs.total += transaction.amount;
    });

    return costs;
  }

  private async calculateRevenue(companyId: string, period: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('company_id', companyId)
      .eq('type', 'revenue')
      .gte('date', period.start.toISOString())
      .lte('date', period.end.toISOString());

    if (error) throw error;

    const revenue = {
      printing: 0,
      scanning: 0,
      services: 0,
      total: 0
    };

    data.forEach(transaction => {
      revenue[transaction.category] += transaction.amount;
      revenue.total += transaction.amount;
    });

    return revenue;
  }

  private calculateProfitability(costs: any, revenue: any) {
    const grossProfit = revenue.total - costs.total;
    const netProfit = grossProfit - (costs.labor + costs.maintenance);

    return {
      grossMargin: (grossProfit / revenue.total) * 100,
      netMargin: (netProfit / revenue.total) * 100,
      roi: this.calculateROI(costs.total, revenue.total),
      paybackPeriod: this.calculatePaybackPeriod(costs.total, revenue.total)
    };
  }

  private async calculateTrends(companyId: string, period: { start: Date; end: Date }) {
    const { data, error } = await supabase
      .from('financial_trends')
      .select('*')
      .eq('company_id', companyId)
      .gte('date', period.start.toISOString())
      .lte('date', period.end.toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    return {
      costTrend: data.map(d => d.costs),
      revenueTrend: data.map(d => d.revenue),
      profitTrend: data.map(d => d.profit),
      timestamps: data.map(d => new Date(d.date))
    };
  }

  private async calculateKPIs(companyId: string, period: { start: Date; end: Date }) {
    const [costs, usage, revenue, satisfaction] = await Promise.all([
      this.getTotalCosts(companyId),
      this.getEquipmentUsage(companyId),
      this.getTotalRevenue(companyId),
      this.getCustomerSatisfaction(companyId)
    ]);

    return {
      costPerPage: costs / usage.totalPages,
      revenuePerDevice: revenue / usage.totalDevices,
      utilizationRate: usage.utilizationRate,
      customerSatisfaction: satisfaction
    };
  }

  private async getCurrentBudget(companyId: string): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return data;
  }

  private async generateInsights(metrics: FinancialMetrics, budget: Budget) {
    const insights = {
      summary: this.generateSummary(metrics, budget),
      recommendations: this.generateRecommendations(metrics, budget),
      risks: this.identifyRisks(metrics, budget)
    };

    return insights;
  }

  private generateSummary(metrics: FinancialMetrics, budget: Budget): string {
    const performance = metrics.profitability.netMargin > this.PROFIT_MARGIN_THRESHOLD
      ? 'acima do esperado'
      : 'abaixo do esperado';

    const budgetStatus = budget.total.spent <= budget.total.allocated
      ? 'dentro do orçamento'
      : 'acima do orçamento';

    return `Desempenho financeiro ${performance}, ${budgetStatus}. ` +
           `Margem de lucro de ${metrics.profitability.netMargin.toFixed(2)}% ` +
           `com ROI de ${metrics.profitability.roi.toFixed(2)}%.`;
  }

  private generateRecommendations(metrics: FinancialMetrics, budget: Budget): string[] {
    const recommendations: string[] = [];

    // Recomendações baseadas em custos
    if (metrics.costs.total > budget.total.allocated) {
      recommendations.push(
        'Implementar medidas de redução de custos, focando em manutenção preventiva'
      );
    }

    // Recomendações baseadas em utilização
    if (metrics.kpis.utilizationRate < this.UTILIZATION_TARGET) {
      recommendations.push(
        'Otimizar utilização dos equipamentos através de melhor distribuição de carga'
      );
    }

    // Recomendações baseadas em margem
    if (metrics.profitability.netMargin < this.PROFIT_MARGIN_THRESHOLD) {
      recommendations.push(
        'Revisar política de preços e buscar oportunidades de serviços de valor agregado'
      );
    }

    return recommendations;
  }

  private identifyRisks(metrics: FinancialMetrics, budget: Budget) {
    const risks = [];

    // Risco de estouro de orçamento
    if (budget.total.forecast > budget.total.allocated * 1.1) {
      risks.push({
        description: 'Risco de estouro orçamentário',
        impact: 'high',
        mitigation: 'Implementar controles mais rigorosos de gastos e revisar alocações'
      });
    }

    // Risco de queda de rentabilidade
    if (metrics.profitability.netMargin < this.PROFIT_MARGIN_THRESHOLD) {
      risks.push({
        description: 'Rentabilidade abaixo do ideal',
        impact: 'medium',
        mitigation: 'Analisar estrutura de custos e revisar precificação'
      });
    }

    // Risco de subutilização
    if (metrics.kpis.utilizationRate < this.UTILIZATION_TARGET) {
      risks.push({
        description: 'Baixa utilização dos equipamentos',
        impact: 'medium',
        mitigation: 'Desenvolver estratégias para aumentar volume de impressão'
      });
    }

    return risks;
  }

  private async generateForecasts(companyId: string, metrics: FinancialMetrics) {
    const historicalData = await this.getHistoricalFinancials(companyId);
    
    return {
      nextMonth: this.forecastPeriod(historicalData, 1),
      nextQuarter: this.forecastPeriod(historicalData, 3),
      nextYear: this.forecastPeriod(historicalData, 12)
    };
  }

  private async getHistoricalFinancials(companyId: string) {
    const { data, error } = await supabase
      .from('financial_history')
      .select('*')
      .eq('company_id', companyId)
      .order('date', { ascending: false })
      .limit(24); // 2 anos de dados

    if (error) throw error;
    return data;
  }

  private forecastPeriod(historicalData: any[], months: number) {
    // Implementar modelo de previsão
    const forecast = {
      revenue: this.calculateTrendForecast(historicalData.map(d => d.revenue), months),
      costs: this.calculateTrendForecast(historicalData.map(d => d.costs), months),
      profit: 0
    };

    forecast.profit = forecast.revenue - forecast.costs;
    return forecast;
  }

  private calculateTrendForecast(data: number[], months: number): number {
    // Implementar algoritmo de previsão (ex: média móvel, regressão linear, etc)
    const average = data.reduce((a, b) => a + b, 0) / data.length;
    const trend = (data[0] - data[data.length - 1]) / data.length;
    
    return average + (trend * months);
  }

  private calculateROI(costs: number, revenue: number): number {
    return ((revenue - costs) / costs) * 100;
  }

  private calculatePaybackPeriod(costs: number, monthlyRevenue: number): number {
    return costs / (monthlyRevenue / 12);
  }

  private async getEquipmentUsage(companyId: string) {
    const { data, error } = await supabase
      .from('equipment_usage')
      .select('*')
      .eq('company_id', companyId);

    if (error) throw error;

    return {
      totalPages: data.reduce((acc, curr) => acc + curr.pages, 0),
      totalDevices: data.length,
      utilizationRate: data.reduce((acc, curr) => acc + curr.utilization, 0) / data.length
    };
  }

  private async getCustomerSatisfaction(companyId: string): Promise<number> {
    const { data, error } = await supabase
      .from('customer_satisfaction')
      .select('rating')
      .eq('company_id', companyId);

    if (error) throw error;

    return data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
  }
}

// Exportar instância única do serviço
export const financialAnalysisService = new FinancialAnalysisService();
