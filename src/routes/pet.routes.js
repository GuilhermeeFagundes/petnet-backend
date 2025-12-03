import { Router } from 'express';
import { listPetsController, findPetByIdController, createPetController, updatePetController, deletePetController } from '../controllers/pet.controller.js';

const petRouter = Router();

petRouter.get("/", listPetsController);
petRouter.get("/:id", findPetByIdController);
petRouter.post("/", createPetController);
petRouter.put("/:id", updatePetController);
petRouter.delete("/:id", deletePetController);

export default petRouter;