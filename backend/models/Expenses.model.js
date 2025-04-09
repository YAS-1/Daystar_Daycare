import db from "../config/db.config.js";

// Creating expenses table
const expenses_table = `CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// This table stores operational expenses for the daycare center
export const createExpensesTable = async () => {
    try {
        await db.query(expenses_table);
        console.log('Expenses table created');
    } catch (err) {
        console.log(`Error in creating expenses table: ${err}`);
    }
};

export default createExpensesTable;


