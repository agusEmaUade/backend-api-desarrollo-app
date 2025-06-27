const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');

dotenv.config();

const authenticateToken = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Acceso denegado. No se ha proporcionado token.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario perteneciente a este token ya no existe.'
      });
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'El usuario cambió recientemente la contraseña. Por favor, vuelve a iniciar sesión.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ 
      status: 'fail',
      message: 'Token no válido.' 
    });
  }
};

module.exports = authenticateToken;