/**
 * Interface que define a estrutura de uma empresa
 */
export interface Company {
  /** ID único da empresa */
  id: string;
  /** Nome da empresa */
  name: string;
  /** Documento da empresa */
  document: string;
  /** Data de criação da empresa */
  createdAt: Date;
}

/**
 * Interface base para entidades que possuem ID e timestamps
 */
export interface BaseEntity {
  /** ID único da entidade */
  id: string;
  /** ID da empresa proprietária */
  companyId: string;
  /** Indica se a entidade está ativa */
  active: boolean;
  /** Data de criação da entidade */
  createdAt: Date;
  /** Data de última atualização da entidade */
  updatedAt: Date;
}

/**
 * Interface que define um cliente
 */
export interface Client extends BaseEntity {
  /** Tipo do cliente (PF ou PJ) */
  type: 'PF' | 'PJ';
  /** Documento do cliente */
  document: string;
  /** Nome do cliente */
  name: string;
  /** E-mail do cliente */
  email: string;
  /** Telefone do cliente */
  phone: string;
  /** Endereço do cliente */
  address: {
    /** Logradouro */
    street: string;
    /** Número */
    number: string;
    /** Complemento */
    complement: string;
    /** Bairro */
    neighborhood: string;
    /** Cidade */
    city: string;
    /** Estado */
    state: string;
    /** CEP */
    zipCode: string;
  };
}

/**
 * Interface que define um equipamento de impressão
 */
export interface Equipment {
  id?: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  type: 'printer' | 'scanner' | 'multifunction';
  status: 'active' | 'maintenance' | 'inactive';
  
  // Novas especificações técnicas
  specifications: {
    dpi: string;        // Resolução (ex: 1200x1200)
    ppm: string;        // Páginas por minuto
    voltage: '110v' | '220v' | 'bivolt';
    hasWifi: boolean;   // Conectividade Wi-Fi
    paperSizes: string[]; // Tamanhos de papel suportados
    
    // Novas informações técnicas
    printTechnology: 'inkjet' | 'laser' | 'dot-matrix';
    printColor: 'color' | 'mono';
  };

  // Novos contadores
  counters: {
    initial: number;    // Contador inicial
    current: number;   // Contador atual
  };

  // Informações financeiras
  financial: {
    monthlyRentalRate: number;  // Valor de locação mensal
    pageAllowance: number;      // Franquia de páginas
    excessPageRate: number;     // Valor por página excedente
  };

  // Informações de manutenção
  maintenance?: {
    maintenanceHistory: MaintenanceRecord[];
    nextMaintenanceDate?: Date;
  };

  // Método para calcular alerta de manutenção
  getMaintenanceAlert?: () => MaintenanceAlert;

  companyId?: string;
  departmentId?: string;
  acquisitionDate?: Date;
  notes?: string;
}

/**
 * Interface que define um contato
 */
export interface Contact {
  /** Nome do contato */
  name: string;
  /** E-mail do contato */
  email: string;
  /** Telefone do contato */
  phone: string;
  /** Cargo/Departamento */
  position?: string;
}

/**
 * Interface que define um departamento
 */
export interface Department {
  /** ID do departamento */
  id: string;
  /** Nome do departamento */
  name: string;
  /** Descrição do departamento */
  description?: string;
  /** Nome do responsável pelo departamento */
  contactPerson?: string;
}

/**
 * Interface que define um registro de manutenção
 */
export interface MaintenanceRecord {
  date: Date;
  type: string;
  description: string;
  cost: number;
  technician: string;
}

/**
 * Interface que define um alerta de manutenção
 */
export interface MaintenanceAlert {
  status: 'ok' | 'warning' | 'urgent' | 'overdue';
  daysUntilMaintenance: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

/**
 * Interface que define métricas de equipamentos
 */
export interface EquipmentMetrics {
  totalEquipments: number;
  activeEquipments: number;
  maintenanceCost: number;
  averageMaintenanceCost: number;
  maintenanceFrequency: number;
}

/**
 * Interface que define parâmetros para geração de relatórios
 */
export interface ReportGenerationParams {
  equipments: Equipment[];
  title: string;
  subtitle?: string;
}