const fs = require('fs');
const path = require('path');
const MailService = require('../services/mail');
const handlebars = require('handlebars');

const sendEmail = async (req, res) => {
    try {
        const templatePath = path.resolve(__dirname, '../templates/email.template.hbs');
        const templateSource = fs.readFileSync(templatePath, 'utf8');

        const template = handlebars.compile(templateSource);

        // Datos dinámicos para el email
        const { recipientName, inviterName, projectName, message, invitationLink } = req.body;

        const htmlContent = template({
            title: "¡Te han invitado a Administrando!",
            recipientName,
            inviterName,
            projectName,
            message,
            invitationLink,
        });

        await MailService.sendMail(
            req.body.recipientEmail, // Dirección del destinatario
            `¡Te han invitado a un proyecto en Administrando!`, // Asunto del correo
            htmlContent // Contenido generado del template
        );

        res.status(201).json({ message: "Correo enviado con éxito" });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
    sendEmail,
};