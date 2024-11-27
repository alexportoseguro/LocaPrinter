import { SelectOption } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Opções padrão para tipos de equipamento
 */
export const defaultEquipmentTypes: SelectOption[] = [
  {
    id: uuidv4(),
    value: 'printer',
    label: 'Impressora',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'copier',
    label: 'Copiadora',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'multifunctional',
    label: 'Multifuncional',
    isDefault: true
  }
];

/**
 * Opções padrão para status de equipamento
 */
export const defaultEquipmentStatus: SelectOption[] = [
  {
    id: uuidv4(),
    value: 'available',
    label: 'Disponível',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'rented',
    label: 'Alugado',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'maintenance',
    label: 'Em Manutenção',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'reserved',
    label: 'Reservado',
    isDefault: true
  }
];

/**
 * Opções padrão para tipos de manutenção
 */
export const defaultMaintenanceTypes: SelectOption[] = [
  {
    id: uuidv4(),
    value: 'preventive',
    label: 'Manutenção Preventiva',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'corrective',
    label: 'Manutenção Corretiva',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'installation',
    label: 'Instalação',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'removal',
    label: 'Remoção',
    isDefault: true
  }
];

/**
 * Opções padrão para voltagens
 */
export const defaultVoltageTypes: SelectOption[] = [
  {
    id: uuidv4(),
    value: '110v',
    label: '110V',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: '220v',
    label: '220V',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'bivolt',
    label: 'Bivolt',
    isDefault: true
  }
];

/**
 * Opções padrão para tamanhos de papel
 */
export const defaultPaperSizes: SelectOption[] = [
  {
    id: uuidv4(),
    value: 'a4',
    label: 'A4',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'a3',
    label: 'A3',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'letter',
    label: 'Carta',
    isDefault: true
  },
  {
    id: uuidv4(),
    value: 'legal',
    label: 'Ofício',
    isDefault: true
  }
];
