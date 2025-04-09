import db from '../config/db.config.js';

//Handler function for creating a new schedule
export const createSchedule = async (req, res) => {
    try {
        const { babysitter_id, child_id, date, session_type } = req.body;

        // Check if all required fields are provided
        if (!babysitter_id || !child_id || !date || !session_type) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if session type is valid
        if (session_type !== 'Full-day' && session_type !== 'Half-day') {
            return res.status(400).json({ message: "Invalid session type" });
        }

        // Check if babysitter and child exist
        const [babysitter] = await db.query("SELECT * FROM baby_sitters WHERE id = ?", [babysitter_id]);
        const [child] = await db.query("SELECT * FROM child WHERE id = ?", [child_id]);
        if (babysitter.length === 0) {
            return res.status(400).json({ message: "Babysitter not found" });
        }
        if (child.length === 0) {
            return res.status(400).json({ message: "Child not found" });
        }

        // Check for duplicate schedule
        const [existingSchedule] = await db.query(
            "SELECT * FROM schedules WHERE babysitter_id = ? AND child_id = ? AND date = ? AND session_type = ?",
            [babysitter_id, child_id, date, session_type]
        );
        if (existingSchedule.length > 0) {
            return res.status(409).json({ message: "This schedule already exists" });
        }

        // Insert the new schedule into the database
        const [result] = await db.query(
            "INSERT INTO schedules (babysitter_id, child_id, date, session_type) VALUES (?, ?, ?, ?)",
            [babysitter_id, child_id, date, session_type]
        );

        // Return success response
        res.status(201).json({
            message: "Schedule created successfully",
            success: true,
            scheduleId: result.insertId
        });
        console.log('Schedule created successfully');
    } catch (error) {
        console.log("Error creating schedule:", error);
        res.status(500).json({ message: error.message });
    }
};


//Handler function to get all schedules
export const getAllSchedules = async (req, res) => {
    try {
        const query = `SELECT s.*, bs.fullname AS babysitter_name, c.full_name AS child_name
                        FROM schedules s
                        JOIN baby_sitters bs ON s.babysitter_id = bs.id
                        JOIN child c ON s.child_id = c.id`;
        const [rows] = await db.query(query);
        res.status(200).json({
            message: "All schedules fetched successfully",
            success: true,
            schedules: rows
        });
        console.log('All schedules fetched successfully');
    } catch (error) {
        console.log("Error getting all schedules:", error);
        res.status(500).json({message: error.message});
    }
}



//Handler function to delete a schedule
export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM schedules WHERE id = ?";
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Schedule not found"});
        }

        res.status(200).json({
            message: "Schedule deleted successfully",
            success: true,
            scheduleId: id
        });
        console.log('Schedule deleted successfully');

    } catch (error) {
        console.log("Error deleting schedule:", error);
        res.status(500).json({message: error.message});
    }
}

//Handler function to change the attendance status of a schedule
export const changeAttendanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { attendance_status } = req.body;

        if (!attendance_status) {
            return res.status(400).json({message: "Attendance status is required"});
        }

        if (attendance_status !== 'present' && attendance_status !== 'absent') {
            return res.status(400).json({message: "Invalid attendance status"});
        }

        const query = "UPDATE schedules SET attendance_status = ? WHERE id = ?";
        const [result] = await db.query(query, [attendance_status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Schedule not found"});
        }

        res.status(200).json({
            message: "Attendance status changed successfully",
            success: true,
            scheduleId: id
        });
    } catch (error) {
        console.log("Error changing attendance status:", error);
        res.status(500).json({message: error.message});
    }
}


//Handler function to search for a schedule
export const searchSchedule = async (req, res) => {
    try {
        const { name} = req.query;

        if (!name) {
            return res.status(400).json({message: "Name is required"});
        }

        const query = `SELECT s.*, bs.fullname AS babysitter_name, c.full_name AS child_name
                        FROM schedules s
                        JOIN baby_sitters bs ON s.babysitter_id = bs.id
                        JOIN child c ON s.child_id = c.id
                        WHERE bs.fullname LIKE ? OR c.full_name LIKE ?`;
        const [rows] = await db.query(query, [name, name]);

        if (rows.length === 0) {
            return res.status(404).json({message: "No schedules found"});
        }

        res.status(200).json({
            message: "Schedules found successfully",
            success: true,
            schedules: rows
        });
        console.log('Schedules found successfully');
    } catch (error) {
        console.log("Error searching for schedule:", error);
        res.status(500).json({message: error.message});
    }
}
