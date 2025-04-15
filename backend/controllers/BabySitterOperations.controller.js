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
export { createIncident };


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
        const query = "SELECT fullname FROM baby_sitters WHERE id = ?";
        const [rows] = await db.query(query, [babysitter_id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Babysitter not found",
            });
        }
        res.status(200).json({
            success: true,
            data: { fullname: rows[0].fullname },
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

