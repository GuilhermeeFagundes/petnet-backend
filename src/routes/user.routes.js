import { Router } from 'express';
import { 
    createUserController, 
    listUsersController,
    deleteUserController,
    updatePersonalDataController

} from '../controllers/user.controller.js';
// import { ensureAuthenticated, ensureAdministrator, ensureAdministratorOrSelf } from '../middlewares/auth';

const userRouter = Router();
// const userController = new UserController();



userRouter.post('/', createUserController);
userRouter.get('/', listUsersController);
userRouter.delete('/:usu_cpf', deleteUserController);
userRouter.patch('/:usu_cpf', updatePersonalDataController)


// userRouter.use(ensureAuthenticated);

// userRouter.get('/', ensureAdministrator, userController.findAll);                            // GET all users
// userRouter.get('/:id', ensureAdministratorOrSelf, userController.findById);                  // GET single user
// userRouter.post('/new', ensureAdministrator, userController.create);                         // CREATE user
// userRouter.put('/edit/:id', ensureAdministratorOrSelf, userController.update);               // UPTADE user
// userRouter.delete('/inactivate/:id', ensureAdministratorOrSelf, userController.softDelete);  // DELETE user

export default userRouter;