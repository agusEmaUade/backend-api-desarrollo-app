const nodemailer = require('nodemailer');

// Función para crear el transportador de email
const createTransporter = () => {
   
        // Use SendGrid for production
        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD,
            },
        });
};

// Función principal para enviar emails
const sendEmail = async (options) => {
    try {
        // 1) Validar que las opciones requeridas estén presentes
        if (!options.email || !options.subject || !options.message) {
            throw new Error('Email, subject and message are required');
        }

        // 2) Crear el transportador
        const transporter = createTransporter();

        // 3) Definir las opciones del email
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'Recipe App <noreply@recipeapp.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || undefined, // Optional HTML content
        };

        // 4) Enviar el email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);
        return info;

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Función específica para enviar código de verificación
const sendPasswordResetCode = async (email, code, firstName = '') => {
    const message = `Hola ${firstName},

Tu código de verificación para restablecer la contraseña es: ${code}

Este código es válido por 10 minutos.

Si no solicitaste restablecer tu contraseña, ignora este email.

Saludos,
El equipo de Recipe App`;

    return await sendEmail({
        email: email,
        subject: 'Código de verificación para restablecer contraseña',
        message: message,
    });
};

module.exports = {
    sendEmail,
    sendPasswordResetCode,
};