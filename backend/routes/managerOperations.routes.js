import express from 'express';
import { protectRoute } from '../middleware/protectRoutes.js';
import { registerAdmin, registerBabysitter, registerChild } from '../controllers/operations.controller.js';


const OperationsRouter = express.Router();

OperationsRouter.post('/createAdmin', registerAdmin);
OperationsRouter.post('/registerBabysitter', protectRoute, registerBabysitter);
OperationsRouter.post('/registerChild', protectRoute, registerChild);


export default OperationsRouter;