import express from "express";
import { createExpense, getAllExpenses, deleteExpense, updateExpense } from "../controllers/Expenses.controller.js";
import { protectRoute } from "../middleware/protectRoutes.js";

const managerExpensesRouter = express.Router();

managerExpensesRouter.post("/createExpense", protectRoute, createExpense);
managerExpensesRouter.get("/getAllExpenses", protectRoute, getAllExpenses);
managerExpensesRouter.delete("/deleteExpense/:id", protectRoute, deleteExpense);
managerExpensesRouter.put("/updateExpense/:id", protectRoute, updateExpense);

export default managerExpensesRouter;