# Configuração do Git

## 1. Instalação do Git

1. Baixe o instalador do Git para Windows em: https://git-scm.com/download/win
2. Execute o instalador e siga as instruções
3. Escolha as seguintes opções durante a instalação:
   - Use Git from Git Bash only
   - Use OpenSSL library
   - Checkout Windows-style, commit Unix-style line endings
   - Use MinTTY
   - Enable file system caching
   - Enable Git Credential Manager

## 2. Configuração Inicial

Após a instalação, abra o Git Bash e execute os seguintes comandos:

```bash
# Configure seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"

# Configure o armazenamento de credenciais
git config --global credential.helper store
```

## 3. Autenticação no GitHub

1. Acesse https://github.com/settings/tokens
2. Clique em "Generate new token"
3. Dê um nome ao token
4. Selecione os escopos necessários
5. Clique em "Generate token"
6. Copie o token gerado
7. Use o token como senha ao fazer push para o GitHub

## 4. Inicialização do Repositório

```bash
# Navegue até a pasta do projeto
cd c:/Users/cintr/CascadeProjects/Locaprinternew

# Inicialize o repositório
git init

# Adicione o remote
git remote add origin https://github.com/seu-usuario/locaprinter.git

# Crie e mude para a branch develop
git checkout -b develop

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "feat: initial commit"

# Envie para o GitHub
git push -u origin develop
```

## 5. Fluxo de Trabalho

1. Sempre trabalhe em branches feature:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça commits frequentes:
```bash
git add .
git commit -m "feat: descrição da alteração"
```

3. Envie as alterações:
```bash
git push origin feature/nome-da-feature
```

4. Crie um Pull Request no GitHub para merge na branch develop

## 6. Comandos Úteis

```bash
# Ver status
git status

# Ver histórico
git log

# Atualizar branch
git pull

# Trocar de branch
git checkout nome-da-branch

# Descartar alterações
git checkout -- arquivo

# Ver branches
git branch

# Deletar branch
git branch -d nome-da-branch
```

## 7. Boas Práticas

1. **Commits Semânticos**
   - feat: nova funcionalidade
   - fix: correção de bug
   - docs: documentação
   - style: formatação
   - refactor: refatoração
   - test: testes
   - chore: manutenção

2. **Branches**
   - main: produção
   - develop: desenvolvimento
   - feature/*: novas funcionalidades
   - fix/*: correções
   - release/*: preparação para release

3. **Pull Requests**
   - Descreva as alterações
   - Adicione screenshots se relevante
   - Marque reviewers
   - Vincule issues relacionadas
