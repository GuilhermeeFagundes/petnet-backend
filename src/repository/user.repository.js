import prisma from '../../prisma/prisma.js';

// listar todos os usuarios
const listUsers = async () => {
    return await prisma.user.findMany({
        where: { excluded_at: null }
    });
}

// encontrar usuario por email
const findUserByEmail = async (userEmail) => {
    return await prisma.user.findUnique({
        where: { email: userEmail },
    });
}

// encontrar usuario por cpf
const findUserByCpf = async (userCPF) => {
    return await prisma.user.findUnique({
        where: { cpf: userCPF },
    });
}

// criar usuários
const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData,
    });
}

// Update dados pessoais
const updateUser = async (userCPF, userData) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: userData
    })
}

// Soft delete de usuário pelo id
const deleteUser = async (userCPF) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: { excluded_at: new Date() }
    });
}

// Contato
const createContact = async (userCPF, contactData) => {
    return await prisma.contact.create({
        data: {
            ...contactData,
            user_cpf: userCPF
        }
    });
}

const removeContact = async (contactId) => {
    return await prisma.contact.delete({
        where: { id: Number(contactId) }
    });
}

// Endereço
const createAddress = async (userCPF, addressData) => {
    return await prisma.address.create({
        data: {
            ...addressData,
            user_cpf: userCPF
        }
    });
}

const removeAddress = async (addressId) => {
    return await prisma.address.delete({
        where: { id: Number(addressId) }
    });
}

export { listUsers, findUserByEmail, findUserByCpf, createUser, updateUser, deleteUser, createContact, removeContact, createAddress, removeAddress };
