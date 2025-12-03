import { Router } from 'express';
import { createUserController, listUsersController, deleteUserController, updateUserController, createAddressController } from '../controllers/user.controller.js';
// import { ensureAuthenticated, ensureAdministrator, ensureAdministratorOrSelf } from '../middlewares/auth';

const userRouter = Router();

userRouter.get('/', listUsersController);
userRouter.post('/', createUserController);
userRouter.patch('/:user_cpf', updateUserController);
userRouter.delete('/:user_cpf', deleteUserController);

// ADDRESS ROUTES
userRouter.post('/:user_cpf', createAddressController);
// userRouter.delete('/:user_cpf', removeAddressController);

export default userRouter;