const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DEV_DB_NAME, process.env.DEV_DB_USERNAME, process.env.DEV_DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});

// Usuarios
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    alias: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Proyectos
const Proyecto = sequelize.define('Proyecto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    montoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

// Tickets
const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    monto: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    concepto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    archivoNombre: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    archivoData: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// Relación Usuarios-Proyectos (Muchos a Muchos)
const UsuarioProyecto = sequelize.define('UsuarioProyecto', {});

// Relación Usuarios-Tickets (Muchos a Muchos)
const UsuarioTicket = sequelize.define('UsuarioTicket', {});

// Relaciones
Usuario.belongsToMany(Proyecto, { through: UsuarioProyecto });
Proyecto.belongsToMany(Usuario, { through: UsuarioProyecto });

Proyecto.hasMany(Ticket, { foreignKey: 'proyectoId', onDelete: 'CASCADE' });
Ticket.belongsTo(Proyecto, { foreignKey: 'proyectoId' });

Usuario.belongsToMany(Ticket, { through: UsuarioTicket });
Ticket.belongsToMany(Usuario, { through: UsuarioTicket });


sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.log('Error: ', err);
    });

module.exports = {
    sequelize,
    Usuario,
    Proyecto,
    Ticket,
    UsuarioProyecto,
    UsuarioTicket,
};