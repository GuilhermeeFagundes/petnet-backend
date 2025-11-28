import { Router } from 'express';
import { listPetsController, findPetByIdController, createPetController} from '../controllers/pet.controller.js';

const petRouter = Router();

petRouter.get("/", listPetsController);

petRouter.get("/:id", findPetByIdController);

petRouter.post("/", createPetController);

export default petRouter;