import db from '../config/db.js';


//Handler function to create a new incident
export const createIncident = async (req, res) => {
    try {
        const { child_id, babysitter_id, incident_date, incident_type, description } = req.body;

        if (!child_id || !babysitter_id || !incident_date || !incident_type || !description) {
            return res.status(400).json({message: "All fields are required"});
        }

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
        const query = "SELECT * FROM incidents";
        const [results] = await db.query(query);

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


//Sending email to the child's guardian when an incident is reported








