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
            return res.status(404).json({message: "No incidents reported by you"});
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

