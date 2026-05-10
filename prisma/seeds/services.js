export async function seedServices(prisma) {
  // Nova regra: Só cria se não houver nenhum serviço cadastrado
  const count = await prisma.service.count();

  if (count > 0) {
    console.log('⏭️  Serviços já cadastrados. Pulando seed de serviços.');
    return;
  }

  const services = [
    {
      name: 'Banho',
      description: 'Limpeza profunda com produtos premium e secagem cuidadosa para deixar seu pet cheiroso e relaxado.',
    },
    {
      name: 'Banho e Tosa na Máquina',
      description: 'O combo perfeito de higiene e praticidade, ideal para manter o pelo curto e facilitar o dia a dia.',
    },
    {
      name: 'Banho e Tosa na Tesoura',
      description: 'Cuidado artesanal para um acabamento impecável e personalizado, respeitando o estilo e volume natural do seu pet.',
    },
    {
      name: 'Banho e Tosa Higiênica',
      description: 'Foco no bem-estar e saúde, removendo pelos em áreas críticas para garantir máximo conforto e higiene.',
    },
    {
      name: 'Ozonioterapia',
      description: 'Tratamento terapêutico avançado com oxigênio ativo, auxiliando na regeneração da pele e combate a fungos e bactérias.',
    },
    {
      name: 'Hidratação',
      description: 'Reposição intensa de nutrientes para pelos sedosos, brilhantes e sem nós. Um verdadeiro dia de SPA para seu amiguinho!',
    },
    {
      name: 'Banho Medicamentoso',
      description: 'Cuidado especializado com shampoos terapêuticos, ideal para pets com sensibilidade dermatológica ou tratamentos específicos.',
    },
    {
      name: 'Corte de Unha',
      description: 'Procedimento seguro e rápido para evitar desconfortos, arranhões e garantir a pisada correta do seu pet.',
    },
  ];

  console.log('🌱 Semeando serviços iniciais...');

  for (const serviceData of services) {
    await prisma.service.create({
      data: serviceData,
    });
    console.log(`   - Serviço criado: ${serviceData.name}`);
  }

  console.log('✅ Cadastro inicial de serviços concluído.');
}
