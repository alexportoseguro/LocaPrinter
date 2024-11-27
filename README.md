# LocaPrinter

Sistema de gestão para locação de impressoras e equipamentos, com suporte a múltiplas empresas, gestão de clientes, equipamentos e relatórios de contadores.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) (recomendado)

## Configuração do Ambiente

1. **Clone o repositório:**
```bash
git clone https://github.com/alexportoseguro/LocaPrinter.git
cd LocaPrinter
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

4. **Inicie os serviços Docker:**
```bash
docker-compose up -d
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Funcionalidades

### Dashboard
- Estatísticas em tempo real
- Gráficos de evolução de equipamentos
- Visualização de manutenções pendentes

### Gestão de Clientes
- Cadastro e edição de clientes
- Gerenciamento de departamentos
- Histórico de locações

### Gestão de Equipamentos
- Cadastro de impressoras e equipamentos
- Monitoramento de status
- Histórico de manutenções
- Relatórios de contadores

### Relatórios
- Geração de relatórios customizados
- Exportação em múltiplos formatos
- Análise de dados históricos

### Suporte Técnico
- Abertura de chamados
- Acompanhamento de status
- Base de conhecimento

## Tecnologias Utilizadas

- React com TypeScript
- Material-UI para interface
- Node.js para backend
- PostgreSQL para banco de dados
- Redis para cache
- MinIO para armazenamento de arquivos
- Docker para containerização

## Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
