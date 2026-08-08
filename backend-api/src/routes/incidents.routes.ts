import { Router } from "express";
import * as incidentsController from "../controllers/incidents.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { Role } from "@prisma/client";
import { upload } from "../middleware/upload";

const router = Router();

router.use(authenticate);
router.post("/", upload.single("evidence"), incidentsController.create);
router.get(
  "/",
  authorize([Role.ADMIN, Role.SOCIAL_WORKER]),
  incidentsController.getAll,
);
router.get("/victim/:victimId", incidentsController.getByVictim);
router.get("/:id", incidentsController.getById);

export default router;
