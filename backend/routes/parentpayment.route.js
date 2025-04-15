import express from 'express';
import { createParentPayment, getAllParentPayments, updateParentPayment, deleteParentPayment, sendPaymentReminder } from '../controllers/ParentPayment.controller.js';
import { protectRoute } from '../middleware/protectRoutes.js';

const parentPaymentRouter = express.Router();

parentPaymentRouter.post('/createParentPayment', protectRoute, createParentPayment);
parentPaymentRouter.get('/getAllParentPayments', protectRoute, getAllParentPayments);
parentPaymentRouter.put('/updateParentPayment/:id', protectRoute, updateParentPayment);
parentPaymentRouter.delete('/deleteParentPayment/:id', protectRoute, deleteParentPayment);
parentPaymentRouter.post('/sendPaymentReminder/:id', protectRoute, sendPaymentReminder);

export default parentPaymentRouter;
