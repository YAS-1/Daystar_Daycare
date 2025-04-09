import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import db from "./config/db.config.js";
import createBabySittersTable from "./models/BabySitter.model.js";
import createManagerTable from "./models/Manager.model.js";
import createChildTable from "./models/Child.model.js";
import createSchedulesTable from "./models/Schedules.model.js";
import createExpensesTable from "./models/Expenses.model.js";
import createParentPaymentsTable from "./models/ParentPayments.model.js";

import AuthRouter from "./routes/auth.route.js";
import OperationsRouter from "./routes/managerRegistrationOperations.routes.js";
import scheduleRouter from "./routes/managerScheduleOperations.routes.js";
import createIncidentsTable from "./models/Incident.model.js";
import incidentRouter from "./routes/incidents.route.js";
import managerExpensesRouter from "./routes/managerExpenses.route.js";
import parentPaymentRouter from "./routes/parentpayment.route.js";
import babysitterOperationsRouter from "./routes/BabySitterOperations.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.WEB_PORT || 3337;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing urlencoded bodies in the request
app.use(cookieParser()); //for parsing cookies in the request


//Routes
app.use("/api/auth", AuthRouter);
app.use("/api/operations", OperationsRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/incidents", incidentRouter);
app.use("/api/expenses", managerExpensesRouter);
app.use("/api/parentpayments", parentPaymentRouter);
app.use("/api/babysitter", babysitterOperationsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS enabled for frontend at http://localhost:5173`);

    createBabySittersTable();
    createManagerTable();
    createChildTable();
    createSchedulesTable();
    createIncidentsTable();
    createExpensesTable();
    createParentPaymentsTable();
});



