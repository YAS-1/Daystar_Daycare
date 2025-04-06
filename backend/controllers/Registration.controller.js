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

        //Checking if each field has been provided individually
        if (!full_name) {
            return res.status(400).json({message: "Full name is required"});
        }
        if (!age) {
            return res.status(400).json({message: "Age is required"});
        }
        if (!gender) {
            return res.status(400).json({message: "Gender is required"});
        }
        if (!parent_guardian_name) {
            return res.status(400).json({message: "Parent/guardian name is required"});
        }
        if (!parent_guardian_phone) {
            return res.status(400).json({message: "Parent/guardian phone number is required"});
        }
        if (!parent_guardian_email) {
            return res.status(400).json({message: "Parent/guardian email is required"});
        }
        if (!parent_guardian_relationship) {
            return res.status(400).json({message: "Parent/guardian relationship is required"});
        }
        if (!Duration_of_stay) {
            return res.status(400).json({message: "Duration of stay is required"});
        }

        //Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(parent_guardian_email)) {
            return res.status(400).json({message: "Invalid email"});
        }
        //Checking if the email already exists
        const [existingEmail] = await db.query("SELECT * FROM child WHERE parent_guardian_email = ?", [parent_guardian_email]);
        if (existingEmail.length > 0) {
            return res.status(400).json({message: "Email already in use"});
        }
        //Check if phone number is valid
        if (!parent_guardian_phone.startsWith('07') || parent_guardian_phone.length !== 10) {
            return res.status(400).json({message: "Invalid phone number"});
        }
        //Check if duration of stay is valid
        if (Duration_of_stay !== 'Full-day' && Duration_of_stay !== 'Half-day') {
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




//Handler function to update the details of a babysitter
export const updateBabysitter = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, age, gender, NIN, email, phone, password, next_of_kin_name, next_of_kin_phone, next_of_kin_relationship } = req.body;

        // Check if the babysitter exists
        const [existingBabysitter] = await db.query("SELECT * FROM baby_sitters WHERE id = ?", [id]);
        
        if (existingBabysitter.length === 0) {
            return res.status(404).json({ message: "Babysitter not found" });
        }

        // Check if the email is already in use by another babysitter
        if (email) {
            const [existingEmail] = await db.query("SELECT * FROM baby_sitters WHERE email = ? AND id != ?", [email, id]);
            if (existingEmail.length > 0) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Fetch current babysitter data
        const selectQuery = `SELECT * FROM baby_sitters WHERE id = ?`;
        const [rows] = await db.query(selectQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Babysitter not found" });
        }

        const currentBabysitter = rows[0];

        // Use existing values if new ones aren't provided, with proper type handling for age
        const updatedFullname = fullname !== undefined ? fullname : currentBabysitter.fullname;
        const updatedAge = age !== undefined ? (age === '' || age === null ? null : parseInt(age, 10)) : currentBabysitter.age;
        const updatedGender = gender !== undefined ? gender : currentBabysitter.gender;
        const updatedNIN = NIN !== undefined ? NIN : currentBabysitter.NIN;
        const updatedEmail = email !== undefined ? email : currentBabysitter.email;
        const updatedPhone = phone !== undefined ? phone : currentBabysitter.phone;
        const updatedPassword = password !== undefined ? password : currentBabysitter.password;
        const updatedNextOfKinName = next_of_kin_name !== undefined ? next_of_kin_name : currentBabysitter.next_of_kin_name;
        const updatedNextOfKinPhone = next_of_kin_phone !== undefined ? next_of_kin_phone : currentBabysitter.next_of_kin_phone;
        const updatedNextOfKinRelationship = next_of_kin_relationship !== undefined ? next_of_kin_relationship : currentBabysitter.next_of_kin_relationship;

        // Build the update query
        const query = `
            UPDATE baby_sitters
            SET fullname = ?, age = ?, gender = ?, NIN = ?, email = ?, phone = ?, password = ?, 
            next_of_kin_name = ?, next_of_kin_phone = ?, next_of_kin_relationship = ?
            WHERE id = ?
        `;
        
        const [result] = await db.query(query, [
            updatedFullname,
            updatedAge,
            updatedGender,
            updatedNIN,
            updatedEmail,
            updatedPhone,
            updatedPassword,
            updatedNextOfKinName,
            updatedNextOfKinPhone,
            updatedNextOfKinRelationship,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Babysitter not found" });
        }

        res.status(200).json({
            message: "Babysitter updated successfully",
            success: true,
            babysitterId: id
        });
        console.log('Babysitter updated successfully');
    } catch (error) {
        console.log("Error updating babysitter:", error);
        res.status(500).json({ message: error.message });
    }
};



//Handler function to update the details of a child
export const updateChild = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, age, gender, parent_guardian_name, parent_guardian_phone, parent_guardian_email, parent_guardian_relationship, special_needs, Duration_of_stay } = req.body;

        // Check if the child exists
        const [existingChild] = await db.query("SELECT * FROM child WHERE id = ?", [id]);
        
        if (existingChild.length === 0) {
            return res.status(404).json({ message: "Child not found" });
        }

        // Check if the email is already in use by another child
        if (parent_guardian_email) {
            const [existingEmail] = await db.query("SELECT * FROM child WHERE parent_guardian_email = ? AND id != ?", [parent_guardian_email, id]);
            if (existingEmail.length > 0) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // Fetch current child data
        const selectQuery = `SELECT * FROM child WHERE id = ?`;
        const [rows] = await db.query(selectQuery, [id]);

        const currentChild = rows[0];

        // Use existing values if new ones aren't provided, with proper type handling for integer fields
        const updatedFullname = full_name !== undefined ? full_name : currentChild.full_name;
        const updatedAge = age !== undefined ? (age === '' || age === null ? null : parseInt(age, 10)) : currentChild.age;
        const updatedGender = gender !== undefined ? gender : currentChild.gender;
        const updatedParentGuardianName = parent_guardian_name !== undefined ? parent_guardian_name : currentChild.parent_guardian_name;
        const updatedParentGuardianPhone = parent_guardian_phone !== undefined ? parent_guardian_phone : currentChild.parent_guardian_phone;
        const updatedParentGuardianEmail = parent_guardian_email !== undefined ? parent_guardian_email : currentChild.parent_guardian_email;
        const updatedParentGuardianRelationship = parent_guardian_relationship !== undefined ? parent_guardian_relationship : currentChild.parent_guardian_relationship;
        const updatedSpecialNeeds = special_needs !== undefined ? special_needs : currentChild.special_needs;
        const updatedDurationOfStay = Duration_of_stay !== undefined ? (Duration_of_stay === '' || Duration_of_stay === null ? null : parseInt(Duration_of_stay, 10)) : currentChild.Duration_of_stay;

        // Build the update query
        const query = `
            UPDATE child
            SET full_name = ?, age = ?, gender = ?, parent_guardian_name = ?, parent_guardian_phone = ?, parent_guardian_email = ?, parent_guardian_relationship = ?, special_needs = ?, Duration_of_stay = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [
            updatedFullname,
            updatedAge,
            updatedGender,
            updatedParentGuardianName,
            updatedParentGuardianPhone,
            updatedParentGuardianEmail,
            updatedParentGuardianRelationship,
            updatedSpecialNeeds,
            updatedDurationOfStay,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Child not found" });
        }
        
        res.status(200).json({
            message: "Child updated successfully",
            success: true,
            childId: id
        });
        console.log('Child updated successfully');

    } catch (error) {
        console.log("Error updating child", error);
        res.status(500).json({ message: error.message });
    }
};


//Handler function to delete a babysitter
export const deleteBabysitter = async (req, res) => {
    try {
        const {id} = req.params;

        //Check if the babysitter exists
        const [existingBabysitter] = await db.query("SELECT * FROM baby_sitters WHERE id = ?", [id]);
        
        if (existingBabysitter.length === 0) {
            return res.status(404).json({message: "Babysitter not found"});
        }

        //Delete the babysitter
        const [result] = await db.query("DELETE FROM baby_sitters WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Babysitter not found"});
        }

        res.status(200).json({
            message: "Babysitter deleted successfully",
            success: true,
            babysitterId: id
        });
        console.log('Babysitter deleted successfully');

    } catch (error) {
        console.log("Error deleting babysitter:", error);
        res.status(500).json({message: error.message});
    }
}


//Handler function to delete a child
export const deleteChild = async (req, res) => {
    try {
        const {id} = req.params;

        //Check if the child exists
        const [existingChild] = await db.query("SELECT * FROM child WHERE id = ?", [id]);
        
        if (existingChild.length === 0) {
            return res.status(404).json({message: "Child not found"});
        }

        //Delete the child
        const [result] = await db.query("DELETE FROM child WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Child not found"});
        }

        res.status(200).json({
            message: "Child deleted successfully",
            success: true,
            childId: id
        });
        console.log('Child deleted successfully');

    } catch (error) {
        console.log("Error deleting child:", error);
        res.status(500).json({message: error.message});
    }
}



//Handler function to get all babysitters
export const getAllBabysitters = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM baby_sitters");

        res.status(200).json({
            message: "All babysitters retrieved successfully",
            success: true,
            babysitters: result
        });
        console.log('All babysitters retrieved successfully');
    } catch (error) {
        console.log("Error retrieving all babysitters:", error);
        res.status(500).json({message: error.message});
    }
}


//Handler function to get all children
export const getAllChildren = async (req, res) => {
    try {
        const [result] = await db.query("SELECT * FROM child");

        res.status(200).json({
            message: "All children retrieved successfully",
            success: true,
            children: result
        });
        console.log('All children retrieved successfully');
    } catch (error) {
        console.log("Error retrieving all children:", error);
        res.status(500).json({message: error.message});
    }
}



//Handler function to get a specific babysitter
export const getBabysitterById = async (req, res) => {
    try {
        const {id} = req.params;
        
        const [result] = await db.query("SELECT * FROM baby_sitters WHERE id = ?", [id]);

        if (result.length === 0) {
            return res.status(404).json({message: "Babysitter not found"});
        }
        
        res.status(200).json({
            message: "Babysitter retrieved successfully",
            success: true,
            babysitter: result[0]
        });
        console.log('Babysitter retrieved successfully');
    } catch (error) {
        console.log("Error retrieving babysitter:", error);
        res.status(500).json({message: error.message});
    }
}


//Handler function to get a specific child
export const getChildById = async (req, res) => {
    try {
            const {id} = req.params;

        const [result] = await db.query("SELECT * FROM child WHERE id = ?", [id]);

        if (result.length === 0) {
            return res.status(404).json({message: "Child not found"});
        }
        
        res.status(200).json({
            message: "Child retrieved successfully",
            success: true,
            child: result[0]
        });
        console.log('Child retrieved successfully');

    } catch (error) {
        console.log("Error retrieving child:", error);
        res.status(500).json({message: error.message});
    }
}