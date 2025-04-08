import db from "../config/db.config.js";


const parent_payments_table = `
    CREATE TABLE IF NOT EXISTS parent_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    schedule_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    session_type ENUM('half-day', 'full-day') NOT NULL,
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES child(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE        
)`;

//Create the table
export const createParentPaymentsTable = async () => {
    try {
        await db.query(parent_payments_table);
        console.log('Parent Payments table created');
    } catch (err) {
        console.log(`Error in creating parent payments table: ${err}`);
    }
};

export default createParentPaymentsTable;
