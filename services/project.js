const { Usuario, Proyecto, UsuarioProyecto } = require("../db/db");

const getPojectById = async (id) => await Proyecto.findByPk(id);
const createProject = async (titulo, descripcion, montoTotal, userId) => {
    const proyecto = await Proyecto.create({
      titulo,
      descripcion,
      montoTotal,
    });
  
    // Asignar el proyecto al usuario
    await proyecto.addUsuario(userId);
    return proyecto;
  };
  const assignUserToProject = async (userId, projectId) => {
    const proyecto = await Proyecto.findByPk(projectId);
    const usuario = await Usuario.findByPk(userId);
  
    if (!proyecto || !usuario) {
      throw new Error("Proyecto o usuario no encontrado");
    }
  
    // Asignar el usuario al proyecto
    await proyecto.addUsuario(usuario);
    return proyecto;
  };
  const getProjectsByUser = async (userId) => {
    const usuario = await Usuario.findByPk(userId, {
      include: Proyecto,  // Incluir los proyectos asociados al usuario
    });
  
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
  
    return usuario.Proyectos;
  };
  const deleteProject = async (projectId) => {
    const proyecto = await Proyecto.findByPk(projectId);
  
    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }
  
    // Eliminar el proyecto
    await proyecto.destroy();
    return { message: "Proyecto eliminado exitosamente" };
  };
  const updateProjectById = async (projectId, updates) => {
    const proyecto = await Proyecto.findByPk(projectId);
  
    if (!proyecto) {
      throw new Error("Proyecto no encontrado");
    }
  
    await proyecto.update(updates);
  
    return proyecto;
  };

module.exports = {
    createProject,
    assignUserToProject,
    getProjectsByUser,
    deleteProject,
    getPojectById,
    updateProjectById
};