import petRepository from "../repository/pet.repository.js";
import { sanitizeData } from "../middlewares/utils.middleware.js";
import { base64ToBuffer, bufferToBase64 } from "../utils/image.utils.js";

export const listPetsService = async () => {
    const pets = await petRepository.listPets();
    return pets.map(pet => {
        if (pet.picture_blob) {
            pet.petPicture = bufferToBase64(pet.picture_blob);
            delete pet.picture_blob;
        }
        return pet;
    });
}

export const findPetsByUserService = async (userCpf) => {
    const pets = await petRepository.findPetsByUserCpf(userCpf);
     return pets.map(pet => {
        if (pet.picture_blob) {
            pet.petPicture = bufferToBase64(pet.picture_blob);
            delete pet.picture_blob;
        }
        return pet;
     });
}

export const findPetByIdService = async (petId) => {
    const pet = await petRepository.findPetById(petId);

    if (!pet) throw new Error("Pet não encontrado");

    if (pet.picture_blob) {
        pet.petPicture = bufferToBase64(pet.picture_blob);
        delete pet.picture_blob;
    }

    return pet;
}

export const createPetService = async (petData) => {
    const { petPicture, ...rest } = petData;

    const petWithPicture = {
        ...rest,
        picture_blob: petPicture ? base64ToBuffer(petPicture) : null
    };

    const allowedFields = ["user_cpf", "name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_blob", "observations"];
    const createData = sanitizeData(allowedFields, petWithPicture);

    if (!createData) {
        throw new Error("Nenhum campo válido enviado");
    }

    return await petRepository.createPet(createData);
}

export const updatePetService = async (petId, petData) => {
    const { petPicture, ...rest } = petData;

    const petWithPicture = {
        ...rest,
        picture_blob: petPicture ? base64ToBuffer(petPicture) : undefined
    };

    const allowedFields = ["name", "species", "breed", "size", "birth_date", "weight", "sex", "picture_blob", "observations"];
    const updateData = sanitizeData(allowedFields, petWithPicture);

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


