import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";
import {
    getPlots,
    createPlotController,
    getPlotById,
    updatePlotController,
    deletePlotController,
    getPlotActivities,
    createPlotActivity
} from "../controllers/plotController";

const router = Router();

router.get("/users", getUsers);
router.post("/users", createUser);

router.get("/plots", getPlots);
router.post("/plots", createPlotController);
router.get("/plots/:id", getPlotById);
router.put("/plots/:id", updatePlotController);
router.delete("/plots/:id", deletePlotController);

router.get("/plots/:id/activities", getPlotActivities);
router.post("/plots/:id/activities", createPlotActivity);

export default router;