const dotenv = require("dotenv");
const { Resend } = require("resend");
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (email, subject, htmlTemplate) => {
    resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject,
        html: htmlTemplate,
    });
};

module.exports = {
    sendMail,
};