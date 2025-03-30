const { Router } = require("express");
const ProjectController = require("../controllers/project");
const { body, check } = require("express-validator");
const validateRequest = require("../middlewares/request_validator");
const authenticateToken = require('../middlewares/authMiddleware');

const router = Router();

router.post(
  "/:userId",
  authenticateToken,
  [
    check("titulo").not().isEmpty(),
    check("descripcion").not().isEmpty(),
    validateRequest,
  ],
  ProjectController.createProject
);

router.post(
  "/:userId/assign",
  authenticateToken,
  [
    check("projectId").not().isEmpty(),
    validateRequest,
  ],
  ProjectController.assignUserToProject
);

router.delete(
  "/:id",   authenticateToken, ProjectController.deleteProject
);

router.get("/:userId", authenticateToken, ProjectController.getProjectsByUser);

router.patch("/:id", authenticateToken, ProjectController.updateProject);

module.exports = router;
