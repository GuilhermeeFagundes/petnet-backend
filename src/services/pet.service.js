import petRepository from "../repository/pet.repository.js";
import { sanitizeData } from "../middlewares/utils.middleware.js";

export const listPetsService = async () => {
    return await petRepository.listPets();
}

export const findPetByIdService = async (petId) => {
    const pet = await petRepository.findPetById(petId);

    if (!pet) throw new Error("Pet não encontrado");

    return pet;
}

export const createPetService = async (petData) => {
    const allowedFields = ["user_cpf", "name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_url", "observations"];
    const createData = sanitizeData(allowedFields, petData);

    if (!createData) {
        throw new Error("Nenhum campo válido enviado");
    }

    return await petRepository.createPet(createData);
}

export const updatePetService = async (petId, petData) => {
    const allowedFields = ["name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_url", "observations"];
    const updateData = sanitizeData(allowedFields, petData);

    //Verifica se foram enviados campos válidos
    if (!updateData) {
        throw new Error("Nenhum campo válido enviado");
    }

    // Verifica se o pet existe
    const petExists = await petRepository.findPetById(petId);

    if (!petExists) {
        throw new Error("Pet não encontrado");
    }

    // Atualiza somente os campos filtrados
    return await petRepository.updatePet(petId, updateData);
}

export const deletePetService = async (petId) => {
    const pet = await petRepository.findPetById(petId);

    if (!pet) {
        throw new Error("Pet não encontrado");
    }

    await petRepository.deletePet(petId);
}


