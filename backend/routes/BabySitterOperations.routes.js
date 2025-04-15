import express from 'express';
import { protectBabysitterRoute } from '../middleware/protectBabysitterRoute.js';
import { getMySchedule, getIncidentsReportedByMe, createIncident, logoutBabysitter, getMyInfo } from '../controllers/BabySitterOperations.controller.js';

const babysitterOperationsRouter = express.Router();

babysitterOperationsRouter.get('/mySchedule', protectBabysitterRoute, getMySchedule);
babysitterOperationsRouter.post('/createIncident', protectBabysitterRoute, createIncident);
babysitterOperationsRouter.get('/incidentsReportedByMe', protectBabysitterRoute, getIncidentsReportedByMe);
babysitterOperationsRouter.post('/logout', protectBabysitterRoute, logoutBabysitter);
babysitterOperationsRouter.get('/me', protectBabysitterRoute, getMyInfo);

export default babysitterOperationsRouter;
