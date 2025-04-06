
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import db from "./config/db.config.js";
import createBabySittersTable from "./models/BabySitter.model.js";
import createManagerTable from "./models/Manager.model.js";
import createChildTable from "./models/Child.model.js";
import createSchedulesTable from "./models/Schedules.model.js";

import AuthRouter from "./routes/auth.route.js";
import OperationsRouter from "./routes/managerRegistrationOperations.routes.js";
import scheduleRouter from "./routes/managerScheduleOperations.routes.js";
import createIncidentsTable from "./models/Incident.model.js";


dotenv.config();

const app = express();

const PORT = process.env.WEB_PORT || 3337;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing urlencoded bodies in the request
app.use(cookieParser()); //for parsing cookies in the request


//Routes
app.use("/api/auth", AuthRouter);
app.use("/api/operations", OperationsRouter);
app.use("/api/schedules", scheduleRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    createBabySittersTable();
    createManagerTable();
    createChildTable();
    createSchedulesTable();
    createIncidentsTable();
});



