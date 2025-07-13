const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const { sendEmail, sendPasswordResetCode } = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Remove password from output
  user.password = undefined;

  // Set cookie options
  const cookieExpiresInDays = Number(process.env.JWT_COOKIE_EXPIRES_IN);
  const cookieOptions = {
    expires: new Date(
      Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, apellido, email, fechaNacimiento, nacionalidad, password, passwordConfirm, role } = req.body;

    // 1) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // 2) Create new user
    const newUser = await User.create({
      name,
      apellido,
      email,
      fechaNacimiento,
      nacionalidad,
      password,
      passwordConfirm,
      role
    });

    // 3) Generate token and send response
    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    // 1) Get refresh token from body
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }

    // 2) Verify refresh token
    const decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.JWT_SECRET
    );

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // 5) Generate new access token
    const token = signToken(currentUser._id);

    // 6) Send response with new token
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('There is no user with that email address.', 404));
    }

    // 2) Generate the random 6-digit verification code
    const resetCode = user.createPasswordResetCode();
    await user.save({ validateBeforeSave: false });

    // 3) Send verification code to user's email
    try {
      await sendPasswordResetCode(user.email, resetCode, user.name);

      res.status(200).json({
        status: 'success',
        message: 'Código de verificación enviado al email!',
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetCodeExpires = undefined;
      user.isPasswordResetCodeVerified = false;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'Hubo un error enviando el email. Inténtalo más tarde!',
          500
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // 1) Check if email and code are provided
    if (!email || !code) {
      return next(new AppError('Please provide email and verification code', 400));
    }

    // 2) Hash the provided code
    const hashedCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    // 3) Find user with matching email and code
    const user = await User.findOne({
      email: email,
      passwordResetCode: hashedCode,
      passwordResetCodeExpires: { $gt: Date.now() },
    });

    // 4) If code is invalid or expired
    if (!user) {
      return next(new AppError('Código de verificación inválido o expirado', 400));
    }

    // 5) Mark code as verified
    user.isPasswordResetCodeVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Código de verificación válido. Puedes proceder a cambiar tu contraseña.',
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, password, passwordConfirm } = req.body;

    // 1) Check if required fields are provided
    if (!email || !code || !password || !passwordConfirm) {
      return next(new AppError('Please provide email, code, password and passwordConfirm', 400));
    }

    // 2) Hash the provided code
    const hashedCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    // 3) Find user with matching email, code, and verified status
    const user = await User.findOne({
      email: email,
      passwordResetCode: hashedCode,
      passwordResetCodeExpires: { $gt: Date.now() },
      isPasswordResetCodeVerified: true,
    });

    // 4) If code is invalid, expired, or not verified
    if (!user) {
      return next(new AppError('Código de verificación inválido, expirado o no verificado', 400));
    }

    // 5) Set the new password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.isPasswordResetCodeVerified = false;
    await user.save();

    // 6) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};