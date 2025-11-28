import petRepository from "../repository/pet.repository.js";

export const listPetsService = async () => {
    return await petRepository.listPets();
};


export const findPetByIdService = async (id) => {
    const pet = await petRepository.findPetById(id);
    if(!pet) throw new Error("Pet não encontrado");
    return pet;
}


export const createPetService = async (data) => {
    return await petRepository.createPet(data);
};


