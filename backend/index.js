
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import db from "./config/db.config.js";
import createBabySittersTable from "./models/BabySitter.model.js";
import createManagerTable from "./models/Manager.model.js";
import AuthRouter from "./routes/auth.route.js";
import OperationsRouter from "./routes/managerOperations.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.WEB_PORT || 3337;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Routes
app.use("/api/auth", AuthRouter);
app.use("/api/operations", OperationsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    createBabySittersTable();
    createManagerTable();
});



