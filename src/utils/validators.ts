export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Calcula os dígitos verificadores
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  // Calcula o primeiro dígito verificador
  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(0))) return false;

  // Calcula o segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(1))) return false;

  return true;
}

export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(cpf.charAt(i)) * (10 - i);
  }

  let resultado = 11 - (soma % 11);
  if (resultado === 10 || resultado === 11) resultado = 0;
  if (resultado !== Number(cpf.charAt(9))) return false;

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(cpf.charAt(i)) * (11 - i);
  }

  resultado = 11 - (soma % 11);
  if (resultado === 10 || resultado === 11) resultado = 0;
  if (resultado !== Number(cpf.charAt(10))) return false;

  return true;
}

export function validatePhone(phone: string): boolean {
  // Remove caracteres não numéricos
  phone = phone.replace(/[^\d]/g, '');

  // Verifica se é um número de telefone válido (8 ou 9 dígitos + DDD)
  return /^(\d{10}|\d{11})$/.test(phone);
}

export function validateEmail(email: string): boolean {
  // Expressão regular para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateCEP(cep: string): boolean {
  // Remove caracteres não numéricos
  cep = cep.replace(/[^\d]/g, '');

  // Verifica se tem 8 dígitos
  return cep.length === 8;
}
