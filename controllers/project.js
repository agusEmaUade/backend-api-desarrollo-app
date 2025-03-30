const ProjectService = require('../services/project');

const getProjectsByUser = async (req, res) => {
    const {
        userId
    } = req.params;
    try {
        const projects = await ProjectService.getProjectsByUser(Number(userId));
        if (!projects) res.status(404).json({
            message: 'Not Found!'
        });

        res.status(200).json(projects);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const createProject = async (req, res) => {
    const {
        userId
    } = req.params;
    const { titulo , descripcion } = req.body;
    try {
        const user = await ProjectService.createProject(titulo, descripcion, 0, Number(userId));
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const assignUserToProject = async (req, res) => {
    const {
        userId
    } = req.params;
    const { projectId } = req.body;
    try {
        const project = await ProjectService.assignUserToProject(Number(userId), Number(projectId));
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteProject = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const result = await ProjectService.deleteProject(Number(id));
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const updateProject = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const updatedProject = await ProjectService.updateProjectById(Number(id), updates);
  
      res.status(200).json({
        message: "Proyecto actualizado con éxito",
        project: updatedProject,
      });
    } catch (err) {
      if (err.message === "Proyecto no encontrado") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Error al actualizar el proyecto" });
      }
    }
  };
  

module.exports = {
    getProjectsByUser,
    createProject,
    assignUserToProject,
    deleteProject,
    updateProject
};