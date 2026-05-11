#!/bin/bash
set -e

# ---- Cores ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ---- Configurações ----
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"
APP_DIR="$(dirname "$0")"

# ---- Validação ----
cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Arquivo $ENV_FILE não encontrado! Abortando deploy.${NC}"
  exit 1
fi

echo -e "${YELLOW}🚀 Iniciando deploy em $(date)${NC}"

# ---- 1. Atualizar código ----
echo -e "${YELLOW}📦 Puxando código mais recente do GitHub...${NC}"
git pull origin main

# ---- 2. Build dos containers ----
echo -e "${YELLOW}🔨 Construindo containers...${NC}"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE build --no-cache

# ---- 3. Rodar Testes (Dentro do Docker) ----
echo -e "${YELLOW}🧪 Rodando testes de segurança dentro do container...${NC}"
if ! docker compose -f $COMPOSE_FILE --env-file $ENV_FILE run --rm test npm test -- --watchAll=false; then
  echo -e "${RED}❌ OS TESTES FALHARAM!${NC}"
  echo -e "${RED}Abortando deploy para manter a versão atual estável no ar.${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Testes aprovados! Prosseguindo com o deploy...${NC}"

# ---- 4. Reiniciar containers ----
echo -e "${YELLOW}♻️  Reiniciando containers com a nova versão...${NC}"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d

# ---- 5. Migrações do Banco ----
echo -e "${YELLOW}🗄️  Rodando migrações do banco de dados...${NC}"
# 'migrate deploy' é seguro para produção (não apaga dados)
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE exec -T api npx prisma migrate deploy

# ---- 6. Seed Opcional ----
echo -e "${YELLOW}❓ Pergunta:${NC}"
read -p "Deseja rodar o seed para atualizar Admin e Serviços? (s/n): " confirm
if [[ $confirm =~ ^[sSyY]$ ]]; then
  echo -e "${YELLOW}🌱 Semeando banco de dados (Seed)...${NC}"
  docker compose -f $COMPOSE_FILE --env-file $ENV_FILE exec -T api npx prisma db seed
  echo -e "${GREEN}✅ Seed finalizado com sucesso!${NC}"
else
  echo -e "${YELLOW}⏭️  Pulando execução de seed.${NC}"
fi

# ---- 7. Limpeza de imagens antigas ----
echo -e "${YELLOW}🧹 Limpando imagens antigas não utilizadas...${NC}"
docker image prune -f

# ---- 8. Status final ----
echo -e "${YELLOW}📊 Status dos containers:${NC}"
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE ps

echo -e "${GREEN}✅ Deploy finalizado com sucesso em $(date)${NC}"