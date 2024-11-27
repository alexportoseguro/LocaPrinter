# Configuração do Ambiente de Desenvolvimento

## Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git
- VS Code (recomendado)
- Docker Desktop

## Extensões VS Code Recomendadas
- ESLint
- Prettier
- GitLens
- Docker
- Thunder Client
- Jest Runner

## Setup Inicial

1. **Clone o repositório:**
```bash
git clone [url-do-repositorio]
cd locaprinter
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

4. **Inicie os serviços Docker:**
```bash
docker-compose up -d
```

5. **Execute as migrações do banco:**
```bash
npm run migrate
```

6. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

## Estrutura do Projeto
```
src/
  ├── components/     # Componentes React
  ├── services/      # Serviços e lógica de negócio
  ├── hooks/         # Hooks personalizados
  ├── contexts/      # Contextos React
  ├── pages/         # Páginas da aplicação
  ├── utils/         # Funções utilitárias
  ├── types/         # Definições de tipos
  └── styles/        # Estilos globais
```

## Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código

## Fluxo de Desenvolvimento
1. Crie uma branch a partir da `develop`
2. Desenvolva a feature
3. Execute os testes
4. Faça o commit seguindo Conventional Commits
5. Abra um Pull Request
6. Aguarde o code review

## Padrões de Código
- Use TypeScript
- Siga o ESLint
- Use Prettier para formatação
- Documente funções complexas
- Escreva testes unitários

## Commits
Seguir o padrão Conventional Commits:
- `feat:` - Nova feature
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

## CI/CD
- GitHub Actions para CI
- Vercel para deploy
- Testes automatizados em PRs
- Deploy automático em staging
