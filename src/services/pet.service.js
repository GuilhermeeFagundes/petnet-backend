import petRepository from "../repository/pet.repository.js";

export const listPetsService = async () => {
    return await petRepository.listPets();
};


export const findPetByIdService = async (id) => {
    const pet = await petRepository.findPetById(id);

    if (!pet) throw new Error("Pet não encontrado");

    return pet;
}


export const createPetService = async (data) => {
    const { pet_raca, pet_especie, pet_nome} = data;

    //RN02: Clientes devem cadastrar o pet apenas com os campos obrigatórios (raça, espécie, nome e data de nascimendo).

    if (!pet_nome || !pet_raca || !pet_especie) {
        throw new Error("Campos obrigatórios: nome, raça, espécie e data de nascimento");
    }

    return await petRepository.createPet(data);
};

export const updatePetService = async (id, data) => {
    const petExists = await petRepository.findPetById(id);

    if (!petExists) {
        throw new Error("Pet não encontrado");
    }

    return await petRepository.updatePet(id, data);
}

export const deletePetService = async (id) => {
    const pet = await petRepository.findPetById(id);

    if (!pet) {
        throw new Error("Pet não encontrado");
    }

    await petRepository.deletePet(id);
}


