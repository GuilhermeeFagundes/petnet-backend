import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// criar usuarios
export const createUser = async (userData) => {

    return await prisma.usu_usuarios.create({
        data: userData, 
    });
};

// encontrar usuario por email
export const findUserByEmail = async (userEmail) => {

    return await prisma.usu_usuarios.findUnique({
        where: {usu_email : userEmail},
    });

}

// econtrar usuario por cpf
export const findeUserByCpf = async (userCPF) => {

    return await prisma.usu_usuarios.findUnique({
        where: {usu_cpf : userCPF},
    });
}

// listar todos os usuarios
export const listUsers = async () => {

    return await prisma.usu_usuarios.findMany({
        where: {usu_data_exclusao : null}
    });

}

