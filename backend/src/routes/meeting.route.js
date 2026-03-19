import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { endMeeting, getMeetings, scheduleMeeting, startMeeting } from "../controllers/meeting.controller.js";

const router = express.Router();

router.get("/", protectRoute, getMeetings);
router.post("/", protectRoute, scheduleMeeting);
router.post("/:id/start", protectRoute, startMeeting);
router.post("/:id/end", protectRoute, endMeeting);

export default router;
