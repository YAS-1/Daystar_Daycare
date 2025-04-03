import db from "../config/db.config.js";

//Creating child table
const child_table = `CREATE TABLE IF NOT EXISTS child (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(255) NOT NULL,
    parent_guardian_name VARCHAR(255) NOT NULL,
    parent_guardian_phone VARCHAR(255) NOT NULL,
    parent_guardian_email VARCHAR(255) NOT NULL,
    parent_guardian_relationship VARCHAR(255) NOT NULL,
    special_needs VARCHAR(225),
    Duration_of_stay VARCHAR(255) NOT NULL
)`;

export const createChildTable = async () => {
    try {
        await db.query(child_table);
        console.log('Child table created');
    } catch (err) {
        console.log(`Error in creating child table: ${err}`);
    }
}

export default createChildTable;
