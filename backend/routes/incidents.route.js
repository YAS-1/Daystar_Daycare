import express from 'express';
import { createIncident, getAllIncidents, deleteIncident, updateIncident } from '../controllers/incident.controller.js';
import { protectRoute } from '../middleware/protectRoutes.js';

const incidentRouter = express.Router();

incidentRouter.post('/createIncident', protectRoute, createIncident);
incidentRouter.get('/getAllIncidents', protectRoute, getAllIncidents);
incidentRouter.delete('/deleteIncident/:id', protectRoute, deleteIncident);
incidentRouter.put('/updateIncident/:id', protectRoute, updateIncident);

export default incidentRouter;



