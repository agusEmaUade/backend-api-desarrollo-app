const { Ticket, Proyecto, Usuario } = require("../db/db");


const getTicketsByProject = async (proyectoId) => {
  return await Ticket.findAll({
    where: { proyectoId },
    include: [
      {
        model: Proyecto,
        include: [Usuario],
      },
    ],
  });
};


const createTicket = async (proyectoId, ticketData, userIds) => {
  const project = await Proyecto.findByPk(proyectoId);
  if (!project) {
    throw new Error("Proyecto no encontrado");
  }

  const newTicket = await Ticket.create({
    ...ticketData,
    proyectoId,
  });

  const users = await Usuario.findAll({ where: { id: userIds } });
  if (users.length !== userIds.length) {
    throw new Error("Algunos usuarios no existen");
  }

  await newTicket.addUsuarios(users); // Relación muchos a muchos
  return newTicket;
};


const updateTicket = async (ticketId, updatedFields) => {
  const [rowsUpdated] = await Ticket.update(updatedFields, {
    where: { id: ticketId },
  });
  return rowsUpdated;
};

const deleteTicket = async (ticketId) => {
  return await Ticket.destroy({
    where: { id: ticketId },
  });
};

module.exports = {
  getTicketsByProject,
  createTicket,
  updateTicket,
  deleteTicket,
};
