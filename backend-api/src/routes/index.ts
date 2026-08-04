import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import victimsRoutes from "./victims.routes";
import socialWorkersRoutes from "./socialWorkers.routes";
import organizationsRoutes from "./organizations.routes";
import incidentsRoutes from "./incidents.routes";
import casesRoutes from "./cases.routes";
import appointmentsRoutes from "./appointments.routes";
import servicesRoutes from "./services.routes";
import messagesRoutes from "./messages.routes";
import notificationsRoutes from "./notifications.routes";
import analyticsRoutes from "./analytics.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "SafeProtect API is running",
    version: "1.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/victims", victimsRoutes);
router.use("/social-workers", socialWorkersRoutes);
router.use("/organizations", organizationsRoutes);
router.use("/incidents", incidentsRoutes);
router.use("/cases", casesRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/services", servicesRoutes);
router.use("/messages", messagesRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
