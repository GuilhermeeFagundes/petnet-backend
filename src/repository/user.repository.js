import prisma from '../../prisma/prisma.js';

// --- USUÁRIOS ---

// Listar todos os usuários (exceto deletados)
export const listUsers = async () => {
    return await prisma.user.findMany({
        where: { excluded_at: null },
        include: {
            addresses: true,
            contacts: true
        }
    });
}

// Encontrar usuário por email
export const findUserByEmail = async (userEmail) => {
    return await prisma.user.findUnique({
        where: { email: userEmail },
    });
}

// Encontrar usuários por tipo (ex: ADMIN, CUSTOMER, COLLABORATOR)
export const findUsersByType = async (userType) => {
    return await prisma.user.findMany({
        where: { type: userType, excluded_at: null },
    });
}

// Encontrar usuário por CPF
export const findUserByCpf = async (userCPF) => {
    return await prisma.user.findUnique({
        where: { cpf: userCPF },
        include: { // Importante para validar se o usuário já tem endereço/contato
            addresses: true,
            contacts: true
        }
    });
}

// Criar usuário
export const createUser = async (userData, addressData, contactData) => {
    return await prisma.user.create({
        data: {
            ...userData,

            addresses: addressData ? {
                create: addressData
            } : undefined,

            contacts: contactData ? {
                create: contactData
            } : undefined,
        },
        include: {
            addresses: true,
            contacts: true
        }
    });
}

// Update dados pessoais do usuário, sincronizando addresses/contacts a partir de arrays:
// cada item é identificado por uma chave única por usuário ("type" em address, "name" em
// contact) — se já existir, é atualizado (upsert); itens que não vierem no array são removidos.
export const updateUser = async (userCPF, userData, addressData, contactData) => {
    return await prisma.$transaction(async (tx) => {
        if (userData) {
            await tx.user.update({
                where: { cpf: userCPF },
                data: userData
            });
        }

        if (addressData) {
            const types = addressData.map(({ type }) => type);

            await tx.address.deleteMany({
                where: { user_cpf: userCPF, type: { notIn: types } }
            });

            await Promise.all(addressData.map(item =>
                tx.address.upsert({
                    where: { user_cpf_type: { user_cpf: userCPF, type: item.type } },
                    update: item,
                    create: { ...item, user_cpf: userCPF }
                })
            ));
        }

        if (contactData) {
            const names = contactData.map(({ name }) => name);

            await tx.contact.deleteMany({
                where: { user_cpf: userCPF, name: { notIn: names } }
            });

            await Promise.all(contactData.map(item =>
                tx.contact.upsert({
                    where: { user_cpf_name: { user_cpf: userCPF, name: item.name } },
                    update: item,
                    create: { ...item, user_cpf: userCPF }
                })
            ));
        }

        return await tx.user.findUnique({
            where: { cpf: userCPF },
            include: {
                addresses: true,
                contacts: true
            }
        });
    });
}

// Soft delete de usuário
export const deleteUser = async (userCPF) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: { excluded_at: new Date() }
    });
}

// Reactivate user
export const reactivateUser = async (userCPF) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: { excluded_at: null }
    });
}

export const clearUserPicture = async (userCPF) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: { picture_blob: null }
    });
}

