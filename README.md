# 🐾 PetNet - Sistema de Gestão para Pet Shop

O **PetNet** é uma solução web desenvolvida para otimizar o agendamento de serviços (banho, tosa, etc.) e o gerenciamento de clientes e pets da empresa parceira **Pet Cão**. O sistema foca na digitalização de processos manuais, oferecendo um fluxo de agendamento intermediado via WhatsApp e painéis administrativos para gerentes e colaboradores.

## 🛠️ Tecnologias Utilizadas

* **Back-end:** Node.js, Express
* **Banco de Dados:** MySQL (Dockerizado)
* **ORM:** Prisma
* **Containerização:** Docker & Docker Compose
* **Controle de Versão:** Git & GitHub

---

## 📋 Pré-requisitos

### ⚠️ Ferramentas Recomendadas (Ambiente Profissional)

Para um ambiente de desenvolvimento profissional e padronizado, **recomendamos fortemente** o uso das seguintes ferramentas:

**Por que essas ferramentas?**
- **WSL2:** Permite usar Linux no Windows sem dual boot, mantendo o melhor dos dois sistemas
- **NVM:** Gerencia múltiplas versões do Node.js facilmente
- **Docker:** Garante que toda a equipe trabalhe no mesmo ambiente, facilita escalabilidade e elimina o famoso "na minha máquina funciona"

**Ferramentas necessárias:**

1. 🐧 **[WSL2](https://www.youtube.com/watch?v=o1_E4PBl30s)** - Windows Subsystem for Linux 2
2. 🟢 **[NVM](https://dev.to/cryptus_neoxys/setting-up-nodejs-with-nvm-on-wsl-2-3828)** - Node Version Manager
3. 🐳 **[Docker Desktop](https://www.digitalocean.com/community/tutorials/how-to-develop-a-docker-application-on-windows-using-wsl-visual-studio-code-and-docker-desktop)** - Para Windows com WSL2
4. 📦 **Git** - Já vem instalado por padrão no WSL2

---

## 🚀 Como Rodar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/GuilhermeeFagundes/petnet-backend.git
cd petnet-backend
```

### 2. Configurar a Versão do Node.js

```bash
nvm install
nvm use
```

Isso instalará e ativará automaticamente a versão do Node.js especificada no projeto.

### 3. Executar o Projeto com Docker

O Docker facilita o setup de desenvolvimento, aproximando o ambiente local do ambiente de produção e garantindo que todos os desenvolvedores trabalhem na mesma configuração.

```bash
docker compose watch
```

**O que acontece automaticamente:**
- ✅ MySQL é iniciado no Docker (porta `5678`)
- ✅ Migrations do Prisma são aplicadas automaticamente
- ✅ API Node.js inicia com **hot-reload** (porta `3000`)
- ✅ **Watch mode ativo**: detecta mudanças e rebuilda quando necessário

#### 🔄 Rebuild Automático

O Docker está configurado para **rebuildar automaticamente** quando você:
- ✏️ Modificar `package.json` (adicionar/remover pacotes)
- 🗄️ Alterar `prisma/schema.prisma` (mudanças no schema)
- 📝 Criar novas migrations

**Resultado:** Sem retrabalho manual! O ambiente sempre estará sincronizado.

### 4. Verificar se Está Funcionando

```bash
# Ver status dos containers
docker compose ps

# Acessar a API
curl http://localhost:3000/healthcheck

# Ver logs em tempo real
docker compose logs -f api
```

---

## 🗄️ Gerenciamento do Banco de Dados

### Criar uma Nova Migration

**Pré-requisito:** Container do banco deve estar rodando

Quando alterar o `schema.prisma`, crie e aplique uma migration:

```bash
npx prisma migrate dev --name nome_da_migration
```

**O que acontece:**
1. Nova migration é criada em `prisma/migrations/`
2. Mudanças são aplicadas no banco de dados
3. Prisma Client é regenerado automaticamente
4. Docker detecta a mudança e rebuilda o container da API

**Exemplo:**
```bash
npx prisma migrate dev --name add_pet_breed_field
```

### Interface Gráfica do Prisma Studio

**Pré-requisito:** Container do banco deve estar rodando

Visualize e edite dados do banco através de uma interface visual:

```bash
npx prisma studio
```

Acesse em: [http://localhost:5555](http://localhost:5555)

---

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor (produção) |
| `npm run dev` | Inicia com nodemon (hot-reload) |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate:dev` | Cria e aplica migrations |
| `npm run prisma:migrate:deploy` | Aplica migrations (produção) |
| `docker compose watch` | Sobe tudo com hot-reload e watch |
| `docker compose up api` | Sobe banco + API (modo normal) |
| `docker compose down` | Para todos os containers |
| `docker compose logs -f api` | Logs da API em tempo real |

---

## 🐳 Comandos Docker Úteis

```bash
# Parar todos os containers
docker compose down

# Parar e limpar tudo (remove volumes/banco)
docker compose down -v

# Rebuild forçado sem cache
docker compose build --no-cache

# Subir apenas o banco de dados
docker compose up db -d

# Acessar o terminal do container da API
docker compose exec api sh
```

---

## 🌐 Variáveis de Ambiente

O arquivo `.env` contém as configurações locais:

```env
DATABASE_URL="mysql://petnet:petnet@localhost:5678/petnet_development"
PORT=3000
NODE_ENV=development
```

**Nota:** No Docker, a URL do banco é ajustada automaticamente para `db:3306` (nome do serviço no `docker-compose.yml`).

---

## 📂 Estrutura do Projeto

```
petnet-backend/
├── 🐳 docker-compose.yml       # Orquestração Docker (banco + API)
├── 🐳 Dockerfile              # Imagem da aplicação
├── 🗄️ prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   ├── migrations/           # Histórico de migrations
│   └── prisma.js             # Cliente Prisma (singleton)
├── 📁 src/
│   ├── server.js             # Ponto de entrada
│   ├── controllers/          # Lógica de requisições
│   ├── services/             # Regras de negócio
│   ├── repository/           # Acesso ao banco
│   └── routes/               # Rotas da API
├── 📦 package.json
└── 📝 README.md
```

---

## 👥 Equipe de Desenvolvimento

Desenvolvido pelos alunos da **FATEC** como projeto acadêmico.

---

## 📄 Licença

Este projeto está sob a licença ISC.








