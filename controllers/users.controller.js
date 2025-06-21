const User = require('../models/User.model');
const Recipe = require('../models/Recipe.model');
const { isBase64Image, validateImageSize } = require('../utils/imageUtils');
const AppError = require('../utils/AppError');

// Filter out fields that are not allowed to be updated
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get current user profile
const getMe = async (req, res) => {
    try {
        // The user is already attached to req.user by the auth middleware
        const user = await User.findById(req.user._id);

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user profile'
        });
    }
};

// Update current user profile
const updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    // 3) If avatar is provided, validate it
    if (req.body.avatar) {
      if (!isBase64Image(req.body.avatar)) {
        return next(new AppError('Invalid image format. Please provide a valid base64 image.', 400));
      }
      
      if (!validateImageSize(req.body.avatar)) {
        return next(new AppError('Image size is too large. Maximum size is 500KB.', 400));
      }
      
      filteredBody.avatar = req.body.avatar;
    }

    // 4) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete current user (set active to false)
const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID (admin only)
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update user (admin only)
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete user (admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Update user avatar
const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return next(new AppError('Please provide an image', 400));
    }
    
    if (!isBase64Image(avatar)) {
      return next(new AppError('Invalid image format. Please provide a valid base64 image.', 400));
    }
    
    if (!validateImageSize(avatar)) {
      return next(new AppError('Image size is too large. Maximum size is 500KB.', 400));
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get user favorites
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    
    res.status(200).json({
      status: 'success',
      results: user.favorites.length,
      data: {
        favorites: user.favorites,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Add recipe to favorites
const addFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    
    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return next(new AppError('No recipe found with that ID', 404));
    }
    
    // Check if already favorited
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(recipeId)) {
      return next(new AppError('Recipe already in favorites', 400));
    }
    
    // Add to favorites
    user.favorites.push(recipeId);
    await user.save({ validateBeforeSave: false });
    
    res.status(200).json({
      status: 'success',
      message: 'Recipe added to favorites',
    });
  } catch (err) {
    next(err);
  }
};

// Remove recipe from favorites
const removeFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: recipeId } },
      { new: true }
    );
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Recipe removed from favorites',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect email or password'
            });
        }

        // 3) Generate tokens
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        // 4) Remove sensitive data
        user.password = undefined;

        // 5) Send response
        res.status(200).json({
            status: 'success',
            token,
            refreshToken,
            data: { user }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { email, alias, password } = req.body;

        // const existingUser = await UserService.getUserByEmail(email);
        // if (existingUser) {
        //     return res.status(400).json({
        //         message: "Email already exists",
        //     });
        // }
        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await UserService.createUser({
            email,
            password: hashedPassword,
        });
        res.status(201).json(user);
    } catch (err) {
        console.error("Error al crear usuario:", err.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateUserPasswordById = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el usuario existe
        const user = await UserService.getUserById(Number(id));
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);

        // Actualizar los campos especificados
        const updatedFields = {
            email: user.email,
            password: hashedPassword,
        };

        // Llamar al servicio para actualizar
        const [rowsUpdated] = await UserService.updateUser(
            Number(id),
            updatedFields
        ); // Devuelve un array con el número de filas afectadas

        if (rowsUpdated === 0) {
            return res
                .status(400)
                .json({ message: "No se pudo actualizar el usuario" });
        }

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

const updateUserEmailById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserService.getUserById(Number(id));
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        const existeMail = await UserService.getUserByEmail(req.body.email);
        if (existeMail) {
            return res.status(404).json({
                message: "El mail ya se encuentra registrado",
            });
        }

        const updatedFields = {
            email: req.body.email,
            password: user.password,
        };

        // Llamar al servicio para actualizar
        const [rowsUpdated] = await UserService.updateUser(
            Number(id),
            updatedFields
        );

        if (rowsUpdated === 0) {
            return res
                .status(400)
                .json({ message: "No se pudo actualizar el usuario" });
        }

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

const recoverPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Buscar al usuario por email
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Actualizar la contraseña a "123"
        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("123", saltRounds);

        const updatedFields = { password: hashedPassword };
        await UserService.updateUserByEmail(user.email, updatedFields);

        const templatePath = path.resolve(
            __dirname,
            "../templates/password-recovery.template.hbs"
        );
        const templateSource = fs.readFileSync(templatePath, "utf8");
        const template = handlebars.compile(templateSource);

        const htmlContent = template({
            recipientName: user.email,
            newPassword: "123",
        });
        //TODO: Descomentar para mandar mail
        //await MailService.sendMail(email, "Tu password fue reseteada", htmlContent);

        res
            .status(200)
            .json({ message: "Password reset successfully and email sent." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const existeUser =  async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await UserService.getUserByEmail(email);

        const message = existingUser ? "existe" : "no existe";

        res.status(201).json(message);
    } catch (err) {
        console.error("Error al crear usuario:", err.message);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    createUser,
    getMe,
    updateMe,
    updateAvatar,
    deleteMe,
    getUser,
    login,
    updateUser,
    deleteUser,
    getFavorites,
    addFavorite,
    removeFavorite,
    updateUserPasswordById,
    updateUserEmailById,
    recoverPassword,
    existeUser,
    getAllUsers
};