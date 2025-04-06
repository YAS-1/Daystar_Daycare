import express from 'express';
import { protectRoute } from '../middleware/protectRoutes.js';
import { registerAdmin, registerBabysitter, registerChild, getAllBabysitters, getAllChildren, getBabysitterById, getChildById, updateBabysitter, updateChild, deleteBabysitter, deleteChild  } from '../controllers/Registration.controller.js';


const OperationsRouter = express.Router();

OperationsRouter.post('/createAdmin', registerAdmin);
OperationsRouter.post('/registerBabysitter', protectRoute, registerBabysitter);
OperationsRouter.post('/registerChild', protectRoute, registerChild);

OperationsRouter.get('/babysitters', protectRoute,getAllBabysitters);
OperationsRouter.get('/babysitters/:id', protectRoute,getBabysitterById);

OperationsRouter.get('/children', protectRoute,getAllChildren);
OperationsRouter.get('/children/:id', protectRoute,getChildById);

OperationsRouter.put('/babysitters/:id', protectRoute,updateBabysitter);
OperationsRouter.put('/children/:id', protectRoute,updateChild);

OperationsRouter.delete('/babysitters/:id', protectRoute,deleteBabysitter);
OperationsRouter.delete('/children/:id', protectRoute,deleteChild);


export default OperationsRouter;