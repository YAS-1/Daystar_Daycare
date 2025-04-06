import db from "../config/db.config.js";

// Creating incidents table
const incidents_table = `CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    babysitter_id INT NOT NULL,
    incident_date DATETIME NOT NULL,
    incident_type ENUM('health', 'behavior', 'safety', 'other') NOT NULL,
    description VARCHAR(255) NOT NULL,
    status ENUM('pending', 'resolved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES child(id) ON DELETE CASCADE,
    FOREIGN KEY (babysitter_id) REFERENCES baby_sitters(id) ON DELETE CASCADE
)`;

// This table stores incident reports related to children, reported by babysitters
export const createIncidentsTable = async () => {
    try {
        await db.query(incidents_table);
        console.log('Incidents table created');
    } catch (err) {
        console.log(`Error in creating incidents table: ${err}`);
    }
};

export default createIncidentsTable;