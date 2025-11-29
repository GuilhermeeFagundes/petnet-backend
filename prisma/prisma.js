import { PrismaClient } from '@prisma/client';

// Usa globalThis para armazenar a instância fora do escopo do módulo
const globalForPrisma = globalThis;

// Cria uma nova instância OU usa a que já existe na memória
const prisma = globalForPrisma.prisma || new PrismaClient();

// Se não estivermos em produção (ou seja, estamos em DEV),
// salvamos a instância na variável global para reutilizá-la no próximo reload.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;