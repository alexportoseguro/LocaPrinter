export function formatCNPJ(cnpj: string): string {
  // Remove caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function formatCPF(cpf: string): string {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Aplica a máscara XXX.XXX.XXX-XX
  return numbers.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    '$1.$2.$3-$4'
  );
}

export function formatPhone(phone: string): string {
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Verifica se é celular (9 dígitos) ou fixo (8 dígitos)
  if (numbers.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return numbers.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3'
    );
  } else if (numbers.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return numbers.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      '($1) $2-$3'
    );
  }
  
  // Retorna o número sem formatação caso não se encaixe nos padrões
  return phone;
}

/**
 * Formata um valor numérico para moeda brasileira
 * @param value Valor numérico a ser formatado
 * @returns String formatada em moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Converte uma string de moeda para número
 * @param value String de moeda brasileira
 * @returns Valor numérico
 */
export const parseCurrency = (value: string): number => {
  return parseFloat(
    value
      .replace(/[^\d,-]/g, '')  // Remove caracteres não numéricos
      .replace(',', '.')        // Troca vírgula por ponto
  ) || 0;
};
