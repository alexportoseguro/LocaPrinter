import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';

type Tables = Database['public']['Tables'];
type EquipmentCertification = Tables['equipment_certifications']['Row'];
type EquipmentSustainability = Tables['equipment_sustainability']['Row'];

interface SustainabilityMetrics {
  paperSaved: number;
  energySaved: number;
  co2Reduced: number;
  treesSaved: number;
  waterSaved: number;
}

interface CertificationStatus {
  id: string;
  equipmentId: string;
  certificationName: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'pending';
}

// Constantes para cálculos de sustentabilidade
const ENERGY_PER_PAGE = 0.04; // kWh por página
const CO2_PER_KWH = 0.5; // kg de CO2 por kWh
const WATER_PER_PAGE = 10; // litros de água por página
const TREES_PER_PAPER = 0.0001; // árvores por folha de papel

export class SustainabilityService {
  private static instance: SustainabilityService;

  private constructor() {}

  public static getInstance(): SustainabilityService {
    if (!SustainabilityService.instance) {
      SustainabilityService.instance = new SustainabilityService();
    }
    return SustainabilityService.instance;
  }

  // Calcula métricas de sustentabilidade para um equipamento
  async calculateEquipmentMetrics(equipmentId: string): Promise<SustainabilityMetrics> {
    try {
      const { data: sustainabilityData } = await supabase
        .from('equipment_sustainability')
        .select('*')
        .eq('equipment_id', equipmentId)
        .single();

      if (!sustainabilityData) {
        return {
          paperSaved: 0,
          energySaved: 0,
          co2Reduced: 0,
          treesSaved: 0,
          waterSaved: 0,
        };
      }

      const paperSaved = sustainabilityData.paper_saved || 0;
      const energySaved = paperSaved * ENERGY_PER_PAGE;
      const co2Reduced = energySaved * CO2_PER_KWH;
      const waterSaved = paperSaved * WATER_PER_PAGE;
      const treesSaved = paperSaved * TREES_PER_PAPER;

      return {
        paperSaved,
        energySaved,
        co2Reduced,
        treesSaved,
        waterSaved,
      };
    } catch (error) {
      console.error('Erro ao calcular métricas de sustentabilidade:', error);
      throw error;
    }
  }

  // Atualiza métricas de sustentabilidade
  async updateMetrics(equipmentId: string, metrics: Partial<SustainabilityMetrics>): Promise<void> {
    try {
      await supabase
        .from('equipment_sustainability')
        .upsert({
          equipment_id: equipmentId,
          paper_saved: metrics.paperSaved,
          energy_saved: metrics.energySaved,
          co2_reduced: metrics.co2Reduced,
          trees_saved: metrics.treesSaved,
          water_saved: metrics.waterSaved,
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Erro ao atualizar métricas de sustentabilidade:', error);
      throw error;
    }
  }

  // Obtém certificações de um equipamento
  async getEquipmentCertifications(equipmentId: string): Promise<CertificationStatus[]> {
    try {
      const { data: certifications } = await supabase
        .from('equipment_certifications')
        .select('*')
        .eq('equipment_id', equipmentId);

      if (!certifications) return [];

      return certifications.map(cert => ({
        id: cert.id,
        equipmentId: cert.equipment_id,
        certificationName: cert.certification_name,
        issueDate: cert.issue_date,
        expiryDate: cert.expiry_date,
        status: this.getCertificationStatus(cert.expiry_date),
      }));
    } catch (error) {
      console.error('Erro ao obter certificações:', error);
      throw error;
    }
  }

  // Determina o status de uma certificação
  private getCertificationStatus(expiryDate: string): 'valid' | 'expired' | 'pending' {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry < now) {
      return 'expired';
    } else if (expiry <= thirtyDaysFromNow) {
      return 'pending';
    }
    return 'valid';
  }

  // Adiciona uma nova certificação
  async addCertification(certification: Omit<CertificationStatus, 'id' | 'status'>): Promise<void> {
    try {
      await supabase.from('equipment_certifications').insert({
        equipment_id: certification.equipmentId,
        certification_name: certification.certificationName,
        issue_date: certification.issueDate,
        expiry_date: certification.expiryDate,
      });
    } catch (error) {
      console.error('Erro ao adicionar certificação:', error);
      throw error;
    }
  }

  // Gera relatório de sustentabilidade
  async generateSustainabilityReport(equipmentId: string): Promise<{
    metrics: SustainabilityMetrics;
    certifications: CertificationStatus[];
  }> {
    try {
      const [metrics, certifications] = await Promise.all([
        this.calculateEquipmentMetrics(equipmentId),
        this.getEquipmentCertifications(equipmentId),
      ]);

      return {
        metrics,
        certifications,
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de sustentabilidade:', error);
      throw error;
    }
  }
}
