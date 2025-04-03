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


//Handler function for registering a new child
export const registerChild = async(req, res) => {
    try {
        const {full_name, age, gender, parent_guardian_name, parent_guardian_phone, parent_guardian_email, parent_guardian_relationship, special_needs, Duration_of_stay} = req.body;

        //Check if all required fields are provided
        if (!full_name || !age || !gender || !parent_guardian_name || !parent_guardian_phone || !parent_guardian_email || !parent_guardian_relationship || !Duration_of_stay) {
            return res.status(400).json({message: "Please provide all required fields"});
        }

        //Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(parent_guardian_email)) {
            return res.status(400).json({message: "Invalid email"});
        }
        //Check if phone number is valid
        if (!parent_guardian_phone.startsWith('07') || parent_guardian_phone.length !== 10) {
            return res.status(400).json({message: "Invalid phone number"});
        }
        //Check if duration of stay is valid
        if (Duration_of_stay !== 'Full_day' && Duration_of_stay !== 'Half_day') {
            return res.status(400).json({message: "Invalid duration of stay"});
        }
        //Check if age is valid
        if (age < 1 || age > 10) {
            return res.status(400).json({message: "Invalid age"});
        }
        //Check if gender is valid
        if (gender !== 'Male' && gender !== 'Female') {
            return res.status(400).json({message: "Invalid gender"});
        }

        //Insert the new child into the database
        const [result] = await db.query(
            "INSERT INTO child (full_name, age, gender, parent_guardian_name, parent_guardian_phone, parent_guardian_email, parent_guardian_relationship, special_needs, Duration_of_stay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [full_name, age, gender, parent_guardian_name, parent_guardian_phone, parent_guardian_email, parent_guardian_relationship, special_needs, Duration_of_stay]
        );

        //Return success response
        res.status(201).json({
            message: "Child registered successfully",
            success: true,
            childId: result.insertId
        });
        console.log('Child registered successfully');
    } catch (error) {
        console.log("Error registering child:", error);
        res.status(500).json({message: error.message});
    }
};