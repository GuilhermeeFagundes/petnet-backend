import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { seedAdmin } from './seeds/admin.js';
import { seedServices } from './seeds/services.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando database seed...');

  try {
    // Ordem de execução (pode ser importante se houver dependências)
    await seedAdmin(prisma);
    await seedServices(prisma);
    
    console.log('✨ Seed finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
