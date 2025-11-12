import { Router } from "express";
import AppointmentService from "../services/appointmentService.js";
import AppointmentController from "../controllers/appointmentsController.js";

const router = Router();
const svc = new AppointmentService();
const controller = new AppointmentController(svc);

router.get("/", (req, res, next) => controller.listAll(req, res, next));

router.get("/available", (req, res, next) => controller.getAvailable(req, res, next));

router.post("/", (req, res, next) => controller.create(req, res, next));

router.delete("/:id", (req, res, next) => controller.cancel(req, res, next));

router.patch("/:id", (req, res, next) => controller.update(req, res, next));

export default router;