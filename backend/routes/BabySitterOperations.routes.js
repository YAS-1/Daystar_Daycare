import express from 'express';
import { protectBabysitterRoute } from '../middleware/protectBabysitterRoute.js';
import { 
    getMySchedule, 
    getIncidentsReportedByMe, 
    createBabysitterIncident, 
    logoutBabysitter, 
    getMyInfo, 
    getChildIdByName 
} from '../controllers/BabySitterOperations.controller.js';

const babysitterOperationsRouter = express.Router();

babysitterOperationsRouter.get('/mySchedule', protectBabysitterRoute, getMySchedule);
babysitterOperationsRouter.post('/createIncident', protectBabysitterRoute, createBabysitterIncident);
babysitterOperationsRouter.get('/incidentsReportedByMe', protectBabysitterRoute, getIncidentsReportedByMe);
babysitterOperationsRouter.post('/logout', protectBabysitterRoute, logoutBabysitter);
babysitterOperationsRouter.get('/me', protectBabysitterRoute, getMyInfo);
babysitterOperationsRouter.get('/child/name/:name', protectBabysitterRoute, getChildIdByName);

export default babysitterOperationsRouter;
