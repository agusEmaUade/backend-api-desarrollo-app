const crypto = require('crypto');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const { sendPasswordResetCode } = require('../utils/email');

/**
 * Servicio para generar y enviar código de verificación
 * @param {string} email - Email del usuario
 * @returns {Object} - Resultado del envío
 */
const sendPasswordResetVerificationCode = async (email) => {
    try {
        // 1) Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError('There is no user with that email address.', 404);
        }

        // 2) Generar código de verificación
        const resetCode = user.createPasswordResetCode();
        await user.save({ validateBeforeSave: false });

        // 3) Enviar código por email
        await sendPasswordResetCode(user.email, resetCode, user.name);

        return {
            status: 'success',
            message: 'Código de verificación enviado al email!',
        };
    } catch (error) {
        // Limpiar datos si hay error
        if (error.name !== 'AppError') {
            const user = await User.findOne({ email });
            if (user) {
                user.passwordResetCode = undefined;
                user.passwordResetCodeExpires = undefined;
                user.isPasswordResetCodeVerified = false;
                await user.save({ validateBeforeSave: false });
            }
        }
        throw error;
    }
};

/**
 * Servicio para verificar código de verificación
 * @param {string} email - Email del usuario
 * @param {string} code - Código de verificación
 * @returns {Object} - Resultado de la verificación
 */
const verifyPasswordResetCode = async (email, code) => {
    try {
        // 1) Validar parámetros
        if (!email || !code) {
            throw new AppError('Please provide email and verification code', 400);
        }

        // 2) Hash del código proporcionado
        const hashedCode = crypto
            .createHash('sha256')
            .update(code)
            .digest('hex');

        // 3) Buscar usuario con código válido
        const user = await User.findOne({
            email: email,
            passwordResetCode: hashedCode,
            passwordResetCodeExpires: { $gt: Date.now() },
        });

        // 4) Verificar si el código es válido
        if (!user) {
            throw new AppError('Código de verificación inválido o expirado', 400);
        }

        // 5) Marcar código como verificado
        user.isPasswordResetCodeVerified = true;
        await user.save({ validateBeforeSave: false });

        return {
            status: 'success',
            message: 'Código de verificación válido. Puedes proceder a cambiar tu contraseña.',
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Servicio para resetear contraseña
 * @param {string} email - Email del usuario
 * @param {string} code - Código de verificación
 * @param {string} password - Nueva contraseña
 * @param {string} passwordConfirm - Confirmación de contraseña
 * @returns {Object} - Usuario actualizado
 */
const resetUserPassword = async (email, code, password, passwordConfirm) => {
    try {
        // 1) Validar parámetros
        if (!email || !code || !password || !passwordConfirm) {
            throw new AppError('Please provide email, code, password and passwordConfirm', 400);
        }

        // 2) Hash del código proporcionado
        const hashedCode = crypto
            .createHash('sha256')
            .update(code)
            .digest('hex');

        // 3) Buscar usuario con código válido y verificado
        const user = await User.findOne({
            email: email,
            passwordResetCode: hashedCode,
            passwordResetCodeExpires: { $gt: Date.now() },
            isPasswordResetCodeVerified: true,
        });

        // 4) Verificar si el código es válido y verificado
        if (!user) {
            throw new AppError('Código de verificación inválido, expirado o no verificado', 400);
        }

        // 5) Actualizar contraseña
        user.password = password;
        user.passwordConfirm = passwordConfirm;
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        user.isPasswordResetCodeVerified = false;
        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Servicio para validar si un código de verificación es válido
 * @param {string} email - Email del usuario
 * @param {string} code - Código de verificación
 * @returns {boolean} - Si el código es válido
 */
const isValidResetCode = async (email, code) => {
    try {
        const hashedCode = crypto
            .createHash('sha256')
            .update(code)
            .digest('hex');

        const user = await User.findOne({
            email: email,
            passwordResetCode: hashedCode,
            passwordResetCodeExpires: { $gt: Date.now() },
        });

        return !!user;
    } catch (error) {
        return false;
    }
};

module.exports = {
    sendPasswordResetVerificationCode,
    verifyPasswordResetCode,
    resetUserPassword,
    isValidResetCode,
}; 