import db from '../config/db.config.js';
import { sendEmail } from '../utils/mailer.js';



//Handler function to create a new incident
export const createIncident = async (req, res) => {
    try {
        const { child_id, babysitter_id, incident_date, incident_type, description } = req.body;

        if (!child_id){
            return res.status(400).json({message: "Child ID is required"});
        }
        if (!babysitter_id){
            return res.status(400).json({message: "Babysitter ID is required"});
        }
        if (!incident_date){
            return res.status(400).json({message: "Incident date is required"});
        }
        if (!incident_type){
            return res.status(400).json({message: "Incident type is required"});
        }
        if (!description){
            return res.status(400).json({message: "Description is required"});
        }

        //Checking if the child and babysitter exist
        const childQuery = "SELECT * FROM child WHERE id = ?";
        const [childRows] = await db.query(childQuery, [child_id]);

        if (childRows.length === 0){
            return res.status(404).json({message: "Child not found"});
        }

        const babysitterQuery = "SELECT * FROM baby_sitters WHERE id = ?";
        const [babysitterRows] = await db.query(babysitterQuery, [babysitter_id]);

        if (babysitterRows.length === 0){
            return res.status(404).json({message: "Babysitter not found"});
        }
        
        //Inserting the incident into the database
        const query = "INSERT INTO incidents (child_id, babysitter_id, incident_date, incident_type, description) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(query, [child_id, babysitter_id, incident_date, incident_type, description]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Incident not created"});
        }

        res.status(201).json({
            message: "Incident reported successfully",
            success: true,
            incidentId: result.insertId
        });
    } catch (error) {
        console.log("Error creating incident:", error);
        res.status(500).json({message: error.message});
    }
};


//Handler function to get all incidents
export const getAllIncidents = async (req, res) => {
    try {

        //Fetching the incidents details with the child and babysitter details
        const query = `SELECT i.id, i.incident_date, i.incident_type, i.description, i.status, c.full_name AS child_name, bs.fullname AS babysitter_name
                        FROM incidents i
                        JOIN child c ON i.child_id = c.id
                        JOIN baby_sitters bs ON i.babysitter_id = bs.id`;
        const [results] = await db.query(query);

        if (results.length === 0){
            return res.status(404).json({message: "No incidents found"});
        }

        res.status(200).json({
            message: "All incidents fetched successfully",
            success: true,
            incidents: results
        });
    } catch (error) {
        console.log("Error getting all incidents:", error);
        res.status(500).json({message: error.message});
    }
};


//Handler function to delete an incident
export const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params;

        const query = "DELETE FROM incidents WHERE id = ?";
        const [result] = await db.query(query, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Incident not found"});
        }

        res.status(200).json({
            message: "Incident deleted successfully",
            success: true,
            incidentId: id
        });
    } catch (error) {
        console.log("Error deleting incident:", error);
        res.status(500).json({message: error.message});
    }
};


//Handler function to update an incident
export const updateIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({message: "Status is required"});
        }

        if (status !== 'pending' && status !== 'resolved') {
            return res.status(400).json({message: "Invalid status"});
        }

        const query = "UPDATE incidents SET status = ? WHERE id = ?";
        const [result] = await db.query(query, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Incident not found"});
        }

        res.status(200).json({
            message: "Incident updated successfully",
            success: true,
            incidentId: id
        });
    } catch (error) {
        console.log("Error updating incident:", error);
        res.status(500).json({message: error.message});
    }
};


//Get all incidents by babysitter id
export const getIncidentsByBabySitterId = async (req, res) => {
    try {
        const { babysitter_id } = req.params;

        const query = "SELECT * FROM incidents WHERE babysitter_id = ?";
        const [results] = await db.query(query, [babysitter_id]);
        
        res.status(200).json({
            message: "Incidents fetched successfully",
            success: true,
            incidents: results
        });
    } catch (error) {
        console.log("Error fetching incidents by babysitter id:", error);
        res.status(500).json({message: error.message});
    }
};


//Sending incident report emails to the guardian
export const sendIncidentEmail = async (req, res) => {
    try {
        const { incident_id } = req.params;

        //Fetching the incident details
        const query = "SELECT * FROM incidents WHERE id = ?";
        const [results] = await db.query(query, [incident_id]);

        if (results.length === 0) {
            return res.status(404).json({message: "Incident not found"});
        }

        const incident = results[0];

        //Fetching the child's details
        const childQuery = "SELECT full_name, parent_guardian_name, parent_guardian_email FROM child WHERE id = ?";
        const [childRows] = await db.query(childQuery, [incident.child_id]);

        if (childRows.length === 0) {
            return res.status(404).json({message: "Child not found"});
        }

        const child = childRows[0];

        //Fetching the babysitter's details
        const babysitterQuery = "SELECT fullname, email FROM baby_sitters WHERE id = ?";
        const [babysitterRows] = await db.query(babysitterQuery, [incident.babysitter_id]);

        if (babysitterRows.length === 0 ){
            return res.status(404).json({message: "Babysitter not found"});
        }
        
        const babysitter = babysitterRows[0];

        //The email content
        const subject  = `Incident Report for ${child.full_name}`;
        const text = `
        Dear ${child.parent_guardian_name},

        We wanted to inform you of an incident involving your child ${child.full_name} at Daystar Daycare.

        Incident Details:
        - Date: ${incident.incident_date}
        - Type: ${incident.incident_type}
        - Description: ${incident.description}
        - Reported by: ${babysitter.full_name}

        We have taken immediate action and will continue to monitor the situation.

        Thank you for your understanding and support.

        Best regards,
        Daystar Daycare Team
        `;

        //Sending the email
        await sendEmail(child.parent_guardian_email, subject, text);

        res.status(200).json({message: "Incident email sent successfully"});
    } catch (error) {
        console.log("Error sending incident email:", error);
        res.status(500).json({message: error.message});
    }
};









