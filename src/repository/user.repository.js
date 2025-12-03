import prisma from '../../prisma/prisma.js';

// --- USUÁRIOS ---

// Criar usuário
const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData,
    });
}

// Listar todos os usuários (exceto deletados)
const listUsers = async () => {
    return await prisma.user.findMany({
        where: { excluded_at: null },
        include: { 
            address: true, 
            contact: true 
        } 
    });
}

// Encontrar usuário por email
const findUserByEmail = async (userEmail) => {
    return await prisma.user.findUnique({
        where: { email: userEmail },
    });
}

// Encontrar usuário por CPF
const findUserByCpf = async (userCPF) => {
    return await prisma.user.findUnique({
        where: { cpf: userCPF },
        include: { // Importante para validar se o usuário já tem endereço/contato
            address: true,
            contact: true
        }
    });
}

// Update dados pessoais do usuário
const updateUser = async (userCPF, userData) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: userData
    })
}

// Soft delete de usuário
const deleteUser = async (userCPF) => {
    return await prisma.user.update({
        where: { cpf: userCPF },
        data: { excluded_at: new Date() }
    });
}

// --- CONTATOS ---

const createContact = async (userCPF, contactData) => {
    return await prisma.contact.create({
        data: {
            ...contactData,
            user_cpf: userCPF
        }
    });
}

const updateContact = async (userCPF, contactId,contactData) =>{

    return await prisma.contact.updateMany({
        where:{
            user_cpf: userCPF,
            id: Number(contactId)
        },
        data : contactData

    })

}

const removeContact = async (contactId) => {
    return await prisma.contact.delete({
        where: { id: Number(contactId) }
    });
}

// --- ENDEREÇOS ---

const createAddress = async (userCPF, addressData) => {
    return await prisma.address.create({
        data: {
            ...addressData,
            user_cpf: userCPF
        }
    });
}

const updateAddress = async (userCPF, addressId, addressData) => {
    return await prisma.address.updateMany({
        where: {
            user_cpf: userCPF,      
            id: Number(addressId)   
        },
        data: addressData
    });
}

const removeAddress = async (addressId) => {
    return await prisma.address.delete({

        where: { id: Number(addressId) }

    });
}

export { 
    listUsers, 
    findUserByEmail, 
    findUserByCpf, 
    createUser, 
    updateUser, 
    deleteUser, 
    updateContact,
    createContact, 
    removeContact, 
    createAddress, 
    updateAddress, 
    removeAddress 
};