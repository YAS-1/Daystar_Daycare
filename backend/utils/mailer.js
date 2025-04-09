import nodemailer from 'nodemailer';


//Creating the Nodemailer transporter for sending  emails

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


//Function to send an email
export const sendEmail = async (to, subject, text) => {
    try{
        const mailOptions = {
            from: `"Daystar Daycare" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
        throw new Error("Failed to send email : ",error.message);
    }
};