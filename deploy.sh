#!/bin/bash
set -e

# ---- Colors ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ---- Config ----
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.prod"
APP_DIR="$(dirname "$0")"

# ---- Validação ----
cd $APP_DIR

if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ $ENV_FILE not found! Aborting deploy.${NC}"
  exit 1
fi

echo -e "${YELLOW}🚀 Starting deploy at $(date)${NC}"

# ---- 1. Pull latest code ----
echo -e "${YELLOW}📦 Pulling latest code from GitHub...${NC}"
git pull origin main

# ---- 2. Build containers ----
echo -e "${YELLOW}🔨 Building containers...${NC}"
docker compose -f $COMPOSE_FILE build

# ---- 3. Restart containers ----
echo -e "${YELLOW}♻️  Restarting containers...${NC}"
docker compose -f $COMPOSE_FILE up -d

# ---- 4. Clean up old images ----
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

# ---- 5. Show status ----
echo -e "${YELLOW}📊 Container status:${NC}"
docker compose -f $COMPOSE_FILE ps

echo -e "${GREEN}✅ Deploy done at $(date)${NC}"