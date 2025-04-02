import db from "../config/db.config.js";

//Creating baby sitters table
const baby_sitters_table = `CREATE TABLE IF NOT EXISTS baby_sitters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(255) NOT NULL,
    NIN VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    next_of_kin_name VARCHAR(255) NOT NULL,
    next_of_kin_phone VARCHAR(255) NOT NULL,
    next_of_kin_relationship VARCHAR(255) NOT NULL
)`;

//Creating baby sitters table
// This table will store the details of the baby sitters
export const createBabySittersTable = async () => {
    try{
        await db.query(baby_sitters_table);
        console.log('Baby Sitters Table created');
    } catch (err) {
        console.log(`Error in creating baby sitters table: ${err}`);
    }
}

export default createBabySittersTable;