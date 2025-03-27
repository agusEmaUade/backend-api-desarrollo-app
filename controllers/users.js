const UserSerice = require("../services/users");
const MailService = require("../services/mail");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const getUsers = async (req, res) => {
  try {
    const users = await UserSerice.getUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserSerice.getUserById(Number(id));
    if (!user)
      res.status(404).json({
        message: "Not Found!",
      });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getUserByEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSerice.getUserByEmail(String(email));
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Responder con el token
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserSerice.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await UserSerice.createUser({
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
    const user = await UserSerice.getUserById(Number(id));
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
    const [rowsUpdated] = await UserSerice.updateUser(
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
    const user = await UserSerice.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    const existeMail = await UserSerice.getUserByEmail(req.body.email);
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
    const [rowsUpdated] = await UserSerice.updateUser(
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
    const user = await UserSerice.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Actualizar la contraseña a "123"
    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("123", saltRounds);

    const updatedFields = { password: hashedPassword };
    await UserSerice.updateUserByEmail(user.email, updatedFields);

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

    await MailService.sendMail(email, "Tu password fue reseteada", htmlContent);

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

    const existingUser = await UserSerice.getUserByEmail(email);

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
  getUsers,
  createUser,
  getUserById,
  getUserByEmailAndPassword,
  updateUserPasswordById,
  updateUserEmailById,
  recoverPassword,
  existeUser
};
