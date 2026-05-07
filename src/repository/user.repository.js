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

            addresses: {
                create: addressData
            },

            contacts: {
                create: contactData
            }
        },
        include: {
            addresses: true,
            contacts: true
        }
    });
}

// Update dados pessoais do usuário
export const updateUser = async (userCPF, userData, addressData, contactData) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: {
            ...userData,

            addresses: addressData ? {
                deleteMany: {},
                create: addressData
            } : undefined,

            contacts: contactData ? {
                deleteMany: {},
                create: contactData
            } : undefined
        },
        include: {
            addresses: true,
            contacts: true
        }
    })
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

