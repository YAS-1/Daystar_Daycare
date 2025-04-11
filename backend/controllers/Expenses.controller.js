import db from "../config/db.config.js";

//Create a new expense
export const createExpense = async (req, res) =>{
    try{
        const {category, amount, expense_date, description} = req.body;

        //check if all fields are provided
        if(!category || !amount || !expense_date || !description){
            return res.status(400).json({message: "All fields are required"});
        }

        //insert expense into the database
        const query = "INSERT INTO expenses (category, amount, expense_date, description) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(query, [category, amount, expense_date, description]);

        if(result.affectedRows === 0){
            return res.status(404).json({message: "Expense not created"});
        }

        res.status(201).json({message: "Expense created successfully", expenseId: result.insertId});
    }
    catch(error){
        console.log("Error creating expense:", error);
        res.status(500).json({message: error.message});
    }
};


//Get all expenses
export const getAllExpenses = async (req, res) =>{
    try{
        const query = "SELECT * FROM expenses";
        const [results] = await db.query(query);
        
        if(results.length === 0){
            return res.status(404).json({message: "No expenses found"});
        }

        res.status(200).json(results);
    }
    catch(error){
        console.log("Error fetching expenses:", error);
        res.status(500).json({message: error.message});
    }
};


//Update details of an expense
export const updateExpense = async (req, res) =>{
    try{
        const {id} = req.params;
        const {category, amount, expense_date, description} = req.body;
        
        //check if expense exists
        const query = "SELECT * FROM expenses WHERE id = ?";
        const [result] = await db.query(query, [id]);

        if(result.length === 0){
            return res.status(404).json({message: "Expense not found"});
        }

        //handling if the some fields are not provided
        const currentExpense = result[0];
        const updatedCategory = category !== undefined && category !== "" ? category : currentExpense.category;
        const updatedAmount = amount !== undefined && amount !== "" ? amount : currentExpense.amount;
        const updatedExpenseDate = expense_date !== undefined && expense_date !== "" ? expense_date : currentExpense.expense_date;
        const updatedDescription = description !== undefined && description !== "" ? description : currentExpense.description;

        //update expense
        const updateQuery = "UPDATE expenses SET category = ?, amount = ?, expense_date = ?, description = ? WHERE id = ?";
        const [updateResult] = await db.query(updateQuery, [updatedCategory, updatedAmount, updatedExpenseDate, updatedDescription, id]);

        if(updateResult.affectedRows === 0){
            return res.status(404).json({message: "Expense not updated"});
        }

        res.status(200).json({message: "Expense updated successfully", expenseId: id});
    }
    catch(error){
        console.log("Error updating expense:", error);
        res.status(500).json({message: error.message});
    }
};


//Delete an expense
export const deleteExpense = async (req, res) =>{
    try {
        const {id} = req.params;

        //check if expense exists
        const query = "SELECT * FROM expenses WHERE id = ?";
        const [result] = await db.query(query, [id]);

        if(result.length === 0){
            return res.status(404).json({message: "Expense not found"});
        }

        //delete expense
        const deleteQuery = "DELETE FROM expenses WHERE id = ?";
        const [deleteResult] = await db.query(deleteQuery, [id]);

        if(deleteResult.affectedRows === 0){
            return res.status(404).json({message: "Expense not deleted"});
        }

        res.status(200).json({message: "Expense deleted successfully", expenseId: id});
    }
    catch(error){
        console.log("Error deleting expense:", error);
        res.status(500).json({message: error.message});
    }
};