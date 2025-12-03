import prisma from '../../prisma/prisma.js';

// listar Pets
const listPets = async () => {
    return await prisma.pet.findMany({
        where: { excluded_at: null }
    })
}

// Encontrar Pet por id
const findPetById = async (petId) => {
    return await prisma.pet.findFirst({
        where: {
            id: Number(petId),
            excluded_at: null
        }
    });
}

// Criar Pet
const createPet = async (petData) => {
    return await prisma.pet.create({
        data: petData
    });
}

// Atualizar Pet
const updatePet = async (petId, petData) => {
    return await prisma.pet.update({
        where: { id: Number(petId) },
        data: petData
    });
};

// Deletar Pet(gera a data de exclusão)
const deletePet = async (petId) => {
    return await prisma.pet.update({
        where: { id: Number(petId) },
        data: { excluded_at: new Date() }
    });
}

export default { listPets, findPetById, createPet, updatePet, deletePet };