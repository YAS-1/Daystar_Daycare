import db from "../config/db.config.js";
import { createIncident } from "./incident.controller.js";

//Get my schedule
export const getMySchedule = async (req, res) => {
    try {
        const { babysitter_id } = req.user;

        const query = `
            SELECT 
                s.date,
                s.session_type,
                s.attendance_status,
                c.full_name as child_name
            FROM schedules s
            JOIN child c ON s.child_id = c.id
            WHERE s.babysitter_id = ?
            ORDER BY s.date DESC
        `;

        const [rows] = await db.query(query, [babysitter_id]);

        res.status(200).json({
            success: true,
            message: "My schedule fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error("Error fetching my schedule:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching my schedule",
            error: error.message
        });
    }
};

//Create incident


//Create incident for babysitter
export const createBabysitterIncident = async (req, res) => {
    try {
        const { child_id, incident_type, description, incident_date } = req.body;
        const { babysitter_id } = req.user;

        // Validate required fields
        if (!child_id) {
            return res.status(400).json({ message: "Child ID is required" });
        }
        if (!incident_type) {
            return res.status(400).json({ message: "Incident type is required" });
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" });
        }
        if (!incident_date) {
            return res.status(400).json({ message: "Incident date is required" });
        }

        // Check if child exists
        const [childRows] = await db.query("SELECT * FROM child WHERE id = ?", [child_id]);
        if (childRows.length === 0) {
            return res.status(404).json({ message: "Child not found" });
        }

        // Insert the incident
        const query = `
            INSERT INTO incidents 
            (child_id, babysitter_id, incident_type, description, incident_date, status) 
            VALUES (?, ?, ?, ?, ?, 'pending')
        `;
        
        const [result] = await db.query(query, [
            child_id,
            babysitter_id,
            incident_type,
            description,
            incident_date
        ]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create incident" });
        }

        res.status(201).json({
            success: true,
            message: "Incident reported successfully",
            incidentId: result.insertId
        });
    } catch (error) {
        console.error("Error creating incident:", error);
        res.status(500).json({
            success: false,
            message: "Error creating incident",
            error: error.message
        });
    }
};

//Get incidents reported by me
export const getIncidentsReportedByMe = async (req, res) => {
    try {
        const {babysitter_id} = req.user;
        if (!babysitter_id) {
            return res.status(400).json({message: "Babysitter ID is required"});
        }

        const query = `
            SELECT
                c.full_name as child_name,
                i.incident_type,
                i.description,
                i.incident_date,
                i.status
            FROM incidents i
            JOIN child c ON i.child_id = c.id
            WHERE i.babysitter_id = ?
            ORDER BY i.incident_date DESC
        `;

        const [rows] = await db.query(query, [babysitter_id]);
        if (rows.length === 0) {
            return res.status(200).json({message: "You have not reported any incidents"});
        }

        res.status(200).json({
            success: true,
            message: "Incidents reported by me fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error("Error fetching incidents reported by me:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching incidents reported by me",
            error: error.message
        });
    }
};

export const logoutBabysitter = async (req, res) => {
    try {
        // Remove cookie
        res.clearCookie('token');
        res.status(200).json({message: 'Logout successful'});
        } catch (error) {
            res.status(500).json({message: error.message});
            console.log('Error in logout:', error);
    }
};


export const getMyInfo = async (req, res) => {
    try {
        const { babysitter_id } = req.user;
        const query = "SELECT id, fullname FROM baby_sitters WHERE id = ?";
        const [rows] = await db.query(query, [babysitter_id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Babysitter not found",
            });
        }
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Error fetching babysitter info:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching babysitter info",
            error: error.message,
        });
    }
};

//Get child ID by name
export const getChildIdByName = async (req, res) => {
    try {
        const { name } = req.params;
        
        const query = "SELECT id FROM child WHERE full_name = ?";
        const [rows] = await db.query(query, [name]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Child not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Error fetching child ID:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching child ID",
            error: error.message
        });
    }
};

