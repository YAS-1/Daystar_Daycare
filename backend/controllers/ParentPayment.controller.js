import db from "../config/db.config.js";
import { sendEmail } from "../utils/mailer.js";

//Create a parent payment
export const createParentPayment = async (req, res) => {
    try {
        const {child_id, schedule_id, amount, payment_date, session_type} = req.body;

        //Check if all fields are provided
        if (!child_id || !schedule_id || !amount || !payment_date || !session_type){
            return res.status(400).json({message: "All fields are required"});
        }

        //Check if the child exists
        const childQuery = "SELECT * FROM child WHERE id = ?";
        const [childRows] = await db.query(childQuery, [child_id]);
        if (childRows.length === 0){
            return res.status(404).json({message: "Child not found"});
        }

        //Check if the schedule exists
        const scheduleQuery = "SELECT * FROM schedules WHERE id = ?";
        const [scheduleRows] = await db.query(scheduleQuery, [schedule_id]);
        if (scheduleRows.length === 0){
            return res.status(404).json({message: "Schedule not found"});
        }

        //Check if the amount is a number and greater than 0
        if (isNaN(amount) || amount <= 0){
            return res.status(400).json({message: "Invalid amount"});
        }
        
        const query = `
            INSERT INTO parent_payments (child_id, schedule_id, amount, payment_date, session_type)
            VALUES (?, ?, ?, ?, ?);
        `;

        const [result] = await db.query(query, [child_id, schedule_id, amount, payment_date, session_type]);

        if (result.affectedRows === 0){
            return res.status(400).json({message: "Failed to create parent payment"});
        }

        //Successfully created the payment
        res.status(201).json({
            message: "Parent payment created successfully",
            payment_id: result.insertId
        });
    } catch (error) {
        console.log("Error creating parent payment:", error);
        res.status(500).json({message: error.message});
    }
};


//Get all parent payments
export const getAllParentPayments = async (req, res) => {
    try {
        //Getting the parent payment details and joining with the child and schedule tables
        const query = `
            SELECT 
            pp.id,
            c.full_name AS child_name,
            s.date AS schedule_date,
            pp.amount,
            pp.payment_date,
            pp.session_type,
            pp.status,
            pp.created_at
        FROM parent_payments pp
        JOIN child c ON pp.child_id = c.id
        JOIN schedules s ON pp.schedule_id = s.id
        `;

        const [rows] = await db.query(query);
        res.status(200).json(rows);

    } catch (error) {
        console.log("Error getting all parent payments:", error);
        res.status(500).json({message: error.message});
    }
};

//Updating a parent payment
export const updateParentPayment = async (req, res) => {
    const { id } = req.params;
    const { child_id, schedule_id, amount, payment_date, session_type, status } = req.body;

    const selectQuery = `SELECT * FROM parent_payments WHERE id = ?`;
    const [rows] = await db.query(selectQuery, [id]);
    if (rows.length === 0) {
        return res.status(404).json({ error: "Parent payment not found" });
    }

    const currentPayment = rows[0];
    const updatedChildId = child_id !== undefined && child_id !== "" ? child_id : currentPayment.child_id;
    const updatedScheduleId = schedule_id !== undefined && schedule_id !== "" ? schedule_id : currentPayment.schedule_id;
    const updatedAmount = amount !== undefined ? (isNaN(amount) || Number(amount) <= 0 ? currentPayment.amount : Number(amount)) : currentPayment.amount;
    const updatedPaymentDate = payment_date !== undefined && payment_date !== "" ? payment_date : currentPayment.payment_date;
    const updatedSessionType = session_type !== undefined && session_type !== "" ? session_type : currentPayment.session_type;
    const updatedStatus = status !== undefined && status !== "" ? status : currentPayment.status;

    const query = `
        UPDATE parent_payments 
        SET 
            child_id = ?, 
            schedule_id = ?, 
            amount = ?, 
            payment_date = ?, 
            session_type = ?, 
            status = ?
        WHERE id = ?
    `;

    try {
        const [result] = await db.query(query, [updatedChildId, updatedScheduleId, updatedAmount, updatedPaymentDate, updatedSessionType, updatedStatus, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Parent payment not updated" });
        }
        res.json({ message: "Parent payment updated successfully", paymentId: id });

    } catch (err) {
        res.status(500).json({ error: "Error updating parent payment: " + err.message });
    }
};

//Deleting a parent payment
export const deleteParentPayment = async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM parent_payments WHERE id = ?`;

    try {
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Parent payment not found" });
        }
        res.json({ message: "Parent payment deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: `Error deleting parent payment: ${err.message}` });
    }
};


//Sending payment reminder emails
export const sendPaymentReminder = async (req, res) => {
    try {
        
        const{id} = req.params;

        //Check if the payment exists
        const query = `SELECT * FROM parent_payments WHERE id = ?`;
        const [ParentPaymentRows] = await db.query(query, [id]);
        if (ParentPaymentRows.length === 0){
            return res.status(404).json({message: "Parent payment not found"});
        }

        const payment = ParentPaymentRows[0];

        //Check if payment is paid, then no need to send reminder
        if (payment.status === "paid"){
            return res.status(200).json({message: "Payment already paid"});
        }

        //Fetch child details
        const childQuery = `SELECT * FROM child WHERE id = ?`;
        const [childRows] = await db.query(childQuery, [payment.child_id]);
        if (childRows.length === 0){
            return res.status(404).json({message: "Child not found"});
        }

        const child = childRows[0];

        //Email content
        const subject = `Payment Reminder for ${child.full_name}`;
        const text = `
        Dear ${child.parent_guardian_name},

        This is a friendly reminder regarding your outstanding payment for ${child.full_name}.

        We kindly ask that you make the payment as soon as possible to avoid any inconvenience.

        Please find the details below:

        Child Name: ${child.full_name}
        Amount: ${payment.amount}
        Payment Date: ${payment.payment_date}
        Session Type: ${payment.session_type}
        Status: ${payment.status}

        Please make the payment at your earliest convenience.

        Thank you for your understanding and cooperation.

        Best regards,
        Daystar Daycare
        `;

        //Send email
        await sendEmail(child.parent_guardian_email, subject, text);
        res.status(200).json({message: "Payment reminder sent successfully"});

    } catch (error) {
        console.log("Error sending payment reminder:", error);
        res.status(500).json({message: error.message});
    }
};