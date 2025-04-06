import db from "../config/db.config.js";

// Creating schedules table
const schedules_table = `CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    babysitter_id INT NOT NULL,
    child_id INT NOT NULL,
    date DATE NOT NULL,
    session_type ENUM('half-day', 'full-day') NOT NULL,
    attendance_status ENUM('present', 'absent', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (babysitter_id) REFERENCES baby_sitters(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES child(id) ON DELETE CASCADE
)`;

// This table links babysitters to children for specific sessions and tracks attendance
export const createSchedulesTable = async () => {
    try {
        await db.query(schedules_table);
        console.log('Schedules table created');
    } catch (err) {
        console.log(`Error in creating schedules table: ${err}`);
    }
};

export default createSchedulesTable;