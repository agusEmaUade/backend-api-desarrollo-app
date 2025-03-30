const { Router } = require("express");
const TicketController = require("../controllers/ticket");
const { check } = require("express-validator");
const validateRequest = require("../middlewares/request_validator");
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:projectId",   authenticateToken, TicketController.getTicketsByProject);

router.post(
  "/:projectId",
  authenticateToken,
  [
    check("monto").not().isEmpty().withMessage("El monto es requerido."),
    check("concepto").not().isEmpty().withMessage("El monto es requerido."),
    check("fecha").not().isEmpty().withMessage("La fecha es requerida."),
    check("userIds").isArray().withMessage("Los userIds deben ser un array."),
    validateRequest,
  ],
  TicketController.createTicket
);

router.patch(
  "/:ticketId",
  authenticateToken,
  [
    check("monto").optional().isNumeric().withMessage("El monto debe ser un número."),
    check("fecha").optional().isISO8601().withMessage("La fecha debe tener un formato válido."),
    validateRequest,
  ],
  TicketController.updateTicket
);

router.delete("/:ticketId",   authenticateToken, TicketController.deleteTicket);

router.patch(
  "/:ticketId/file",
  authenticateToken,
  upload.single('file'),
  TicketController.updateTicketFile
);

module.exports = router;
