import prisma from '../../prisma/prisma.js';

export const listPets = async () => {
    return await prisma.pet.findMany({
        where: { excluded_at: null }
    });
};

export const findPetById = async (petId) => {
    return await prisma.pet.findFirst({
        where: {
            id: Number(petId),
            excluded_at: null
        }
    });
};

export const findPetsByUserCpf = async (userCpf) => {
    return await prisma.pet.findMany({
        where: {
            user_cpf: userCpf,
            excluded_at: null
        }
    });
};

export const createPet = async (petData) => {
    return await prisma.pet.create({
        data: petData
    });
};

export const updatePet = async (petId, petData) => {
    return await prisma.pet.update({
        where: { id: Number(petId) },
        data: petData
    });
};

export const deletePet = async (petId) => {
    return await prisma.pet.update({
        where: { id: Number(petId) },
        data: { excluded_at: new Date() }
    });
};

export const clearPetPicture = async (petId) => {
    return await prisma.pet.update({
        where: { id: Number(petId) },
        data: { picture_blob: null }
    });
};

/**
 * Retorna somente o CPF do dono — usado pelo middleware de autorização.
 */
export const findPetOwner = async (petId) => {
    return await prisma.pet.findFirst({
        where: { id: Number(petId), excluded_at: null },
        select: { user_cpf: true },
    });
};