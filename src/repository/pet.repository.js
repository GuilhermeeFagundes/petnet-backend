import prisma from '../prisma.js';

const listPets = async () => {
    return await prisma.pet_pet.findMany({
        where: {
            pet_data_exclusao: null
        }
    })
}

const findPetById = async (id) => {
    return await prisma.pet_pet.findFirst({
        where: {
            pet_id: Number(id),
            pet_data_exclusao: null
        }
    });
}

const createPet = async (data) => {
    return await prisma.pet_pet.create({
        data
    });
};


const updatePet = async (id, data) => {
    return await prisma.pet_pet.update({
        where: { pet_id: Number(id) },
        data
    });
};

const deletePet = async (id) => {
    return await prisma.pet_pet.update({
        where: { pet_id: Number(id) },
        data: { pet_data_exclusao: new Date() }
    });
}

export default {
    listPets,
    findPetById,
    createPet,
    updatePet,
    deletePet
};