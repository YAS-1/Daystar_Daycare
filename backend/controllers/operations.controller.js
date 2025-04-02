import db from "../config/db.config.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/tokenGenrator.js";

//Handler function for registering a new admin
export const registerAdmin = async (req, res) => {
    try {
        const {fullname, age, gender, NIN, email, phone, password} = req.body;
        
        // Check if all required fields are provided
        if (!fullname || !age || !gender || !NIN || !email || !phone || !password) {
            return res.status(400).json({message: 'Please provide all required fields'});
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }
        
        // Check if the user already exists
        const [existingUsers] = await db.query("SELECT * FROM managers WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert the new admin into the database
        const [result] = await db.query(
            "INSERT INTO managers (fullname, age, gender, NIN, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [fullname, age, gender, NIN, email, phone, hashedPassword]
        );
        
        // Generate token and set cookie
        generateTokenAndSetCookie(result.insertId, res);
        
        // Return success response (only once)
        res.status(201).json({ 
            message: "Admin registered successfully",
            success: true,
            adminId: result.insertId 
        });
        console.log('Admin registered successfully');
        
    } catch (error) {
        console.log('Error in registerAdmin:', error);
        res.status(500).json({message: error.message});
    }
};



//Handler function for registering a new babysitter
export const registerBabysitter = async (req, res) => {
    try {
        const {fullname, age, gender, NIN, email, phone, password, next_of_kin_name, next_of_kin_phone, next_of_kin_relationship} = req.body;

        // Check if all required fields are provided
        if (!fullname || !age || !gender || !NIN || !email || !phone || !password || !next_of_kin_name || !next_of_kin_phone || !next_of_kin_relationship) {
            return res.status(400).json({ message: 'Please provide all required fields' });
            }


        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Check if the user already exists
        const [existingUsers] = await db.query("SELECT * FROM baby_sitters WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new babysitter into the database
        const [result] = await db.query(
            "INSERT INTO baby_sitters (fullname, age, gender, NIN, email, phone, password, next_of_kin_name, next_of_kin_phone, next_of_kin_relationship) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [fullname, age, gender, NIN, email, phone, hashedPassword, next_of_kin_name, next_of_kin_phone, next_of_kin_relationship]
        );

        // Generate token and set cookie
        generateTokenAndSetCookie(result.insertId, res);

        // Return success response (only once)
        res.status(201).json({
            message: "Babysitter registered successfully",
            success: true,
            babysitterId: result.insertId
        });
        console.log('Babysitter registered successfully');

    } catch (error) {
        console.log('Error in registerBabysitter:', error);
        res.status(500).json({message: error.message});
    }
};