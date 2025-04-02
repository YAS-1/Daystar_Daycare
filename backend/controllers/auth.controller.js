import db from "../config/db.config.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/tokenGenrator.js";


// This function handles the login process for babysitters
export const babySitterLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({message: 'Please provide email and password'});
        }
        
        // Query database for babysitter with provided email
        const [rows] = await db.query('SELECT * FROM baby_sitters WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({message: 'Email is not registered'});
        }
        
        const user = rows[0];
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Password is incorrect'});
        }
        
        // Generate token and set cookie
        const token = generateTokenAndSetCookie(user.id, res);
        
        // Remove password from user object before sending response
        const { password: _, ...userData } = user;
        
        // Send successful response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                ...userData,
                token
            }
        });
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log('Error in babySitterLogin:', error);
    }
}



// This function handles the login process for managers
export const managerLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({message: 'Please provide email and password'});
        }

        // Query database for manager with provided email
        const [rows] = await db.query('SELECT * FROM managers WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({message: 'Email is not registered'});
        }

        const user = rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({message: 'Password is incorrect'});
        }

        // Generate token and set cookie
        const token = generateTokenAndSetCookie(user.id, res);

        // Remove password from user object before sending response
        const { password: _, ...userData } = user;

        // Send successful response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                ...userData,
                token
            }
        });

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log('Error in managerLogin:', error);
    }
}



// This function handles the logout process for both babysitters and managers
export const logout = async (req, res) => {
    try {
        // Remove cookie
        res.clearCookie('token');
        res.status(200).json({message: 'Logout successful'});
        } catch (error) {
            res.status(500).json({message: error.message});
            console.log('Error in logout:', error);
    }
}