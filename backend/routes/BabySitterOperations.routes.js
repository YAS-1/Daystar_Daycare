import express from 'express';
import { protectBabysitterRoute } from '../middleware/protectBabysitterRoute.js';
import { getMySchedule, getIncidentsReportedByMe, createIncident } from '../controllers/BabySitterOperations.controller.js';

const babysitterOperationsRouter = express.Router();

babysitterOperationsRouter.get('/mySchedule', protectBabysitterRoute, getMySchedule);
babysitterOperationsRouter.post('/createIncident', protectBabysitterRoute, createIncident);
babysitterOperationsRouter.get('/incidentsReportedByMe', protectBabysitterRoute, getIncidentsReportedByMe);

export default babysitterOperationsRouter;
