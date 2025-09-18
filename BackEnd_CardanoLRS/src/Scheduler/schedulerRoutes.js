import express from "express";
import { runSchedulerManually, processUserMappingFeed } from "./scheduler.js";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const result = await processUserMappingFeed();
    res.json({
      success: true,
      message: "Scheduler executed manually",
      result: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error executing scheduler",
      error: error.message,
    });
  }
});

router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Scheduler is running",
    endpoints: {
      manual: "POST /api/scheduler/run",
      status: "GET /api/scheduler/status",
    },
  });
});

export default router;
