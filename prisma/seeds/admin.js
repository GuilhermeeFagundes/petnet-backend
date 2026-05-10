import bcrypt from 'bcrypt';

export async function seedAdmin(prisma) {
  const adminCpf = process.env.ADMIN_CPF;
  const adminName = process.env.ADMIN_NAME || 'Admin TI';
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminCpf || !adminEmail || !adminPassword) {
    console.warn('⚠️  ADMIN_CPF, ADMIN_EMAIL ou ADMIN_PASSWORD não configurados. Pulando seed de Admin.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { cpf: adminCpf },
    update: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      type: 'MANAGER',
    },
    create: {
      cpf: adminCpf,
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      type: 'MANAGER',
    },
  });

  console.log(`✅ Admin TI configurado: ${admin.email}`);
}
