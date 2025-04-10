const { Usuario } = require("../db/db");

const getUsers = async () => await Usuario.findAll();
const getUserById = async (id) => await Usuario.findByPk(id);
const getUserByEmail = async (email) => await Usuario.findOne({ where: { email } });
const createUser = async (user) => await Usuario.create(user);
const getUserByEmailAndPassword = async (email, password) =>
    await Usuario.findOne({
        where: { email, password },
    });
const updateUser = async (id, updatedFields) => {
    return await Usuario.update(updatedFields, {
        where: { id },
    });
};

const updateUserByEmail = async (email, updatedFields) => {
    // Asegúrate de que solo actualizas los campos necesarios
    try {
        console.log(email);
        const [affectedRows] = await Usuario.update(updatedFields, {
            where: { email }
        });
        if (affectedRows === 0) {
            console.log("falle");
            throw new Error('No user found with the provided email.');
        }
        console.log("termine bien: " + affectedRows);
        return affectedRows;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    getUserByEmailAndPassword,
    updateUser,
    getUserByEmail,
    updateUserByEmail
};