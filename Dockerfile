FROM node:22-alpine

WORKDIR /app

# Instalar OpenSSL 3.x necessário para Prisma
RUN apk add --no-cache openssl

# Copiar package files
COPY package*.json ./

# Instalar dependências (incluindo dev para nodemon)
RUN npm install

# Copiar prisma schema
COPY prisma ./prisma

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["npm", "run", "dev"]
