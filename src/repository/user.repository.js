import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// criar usuarios
export const createUser = async (userData) => {

    return await prisma.usu_usuarios.create({
        data: userData,
        include: {
            end_endereco: true,
            con_contato: true,
        }
    });
};

// encontrar usuario por email
export const findUserByEmail = async (userEmail) => {

    return await prisma.usu_usuarios.findUnique({
        where: { usu_email: userEmail },
    });

}

// econtrar usuario por cpf
export const findUserByCpf = async (userCPF) => {

    return await prisma.usu_usuarios.findUnique({
        where: { usu_cpf: userCPF },
    });
}

// listar todos os usuarios
export const listUsers = async () => {

    return await prisma.usu_usuarios.findMany({
        where: { usu_data_exclusao: null }
    });

}

// Update dados pessoais
export const updatePersonalDate = async (userCPF, usu_name, usu_email, con_telefone) => {

    return await prisma.usu_usuarios.update({
        where: {
            usu_cpf: userCPF
        },
        data: {
            usu_nome: usu_name,
            usu_email: usu_email,

            con_contato: con_telefone ? {
                updateMany: {
                    where: { con_usu_cpf: userCPF },
                    data: { con_telefone: con_telefone }
                }
            } : undefined
        },

        include: {
            con_contato: true
        }
    })
}

// Update endereço

// Soft delete de usuário pelo id
export const deleteUser = async (userCPF) => {

    return await prisma.usu_usuarios.update({
        where: {
            usu_cpf: userCPF
        },
        data: {
            usu_data_exclusao: new Date()
        }
    });
}
