import epress from 'express';
import { babySitterLogin, managerLogin, logout } from '../controllers/auth.controller.js';

const AuthRouter = epress.Router();

AuthRouter.post('/babySitter/login',babySitterLogin);
AuthRouter.post('/manager/login',managerLogin);
AuthRouter.post('/logout', logout);    

export default AuthRouter;