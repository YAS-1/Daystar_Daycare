import express from 'express';
import { createSchedule, getAllSchedules, deleteSchedule, searchSchedule, changeAttendanceStatus } from '../controllers/Scheduler.controller.js';
import { protectRoute } from '../middleware/protectRoutes.js';

const scheduleRouter = express.Router();

scheduleRouter.post('/createSchedule', protectRoute, createSchedule);
scheduleRouter.get('/getAllSchedules', protectRoute, getAllSchedules);
scheduleRouter.delete('/deleteSchedule/:id', protectRoute, deleteSchedule);
scheduleRouter.get('/searchSchedule', protectRoute, searchSchedule);
scheduleRouter.put('/changeAttendanceStatus/:id', protectRoute, changeAttendanceStatus);
export default scheduleRouter;



