import db from "../config/db.config.js";

//Creating baby sitters table
const manager_table = `CREATE TABLE IF NOT EXISTS managers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(255) NOT NULL,
    NIN VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
)`;


export const createManagerTable = async () => {
    try{
        await db.query(manager_table);
        console.log('Manager Table created');
    } catch (err) {
        console.log(`Error in creating manager table: ${err}`);
    }
}

export default createManagerTable;