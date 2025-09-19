import cron from "node-cron";
import { processUserMappingFeed } from "../Scheduler/schedulerController.js";

let schedulerRunning = false;

// Function to start the scheduler
export const startScheduler = () => {
  console.log(
    `[${new Date().toISOString()}] Starting user mapping scheduler...`
  );

  // Run immediately on application start
  runSchedulerManually("Application Start");

  // Schedule to run every day at 00:00 (midnight)
  cron.schedule("* * * * *", async () => {
    const now = new Date().toISOString();
    console.log(`[${now}] Cron triggered - attempting to run scheduler...`);

    if (!schedulerRunning) {
      schedulerRunning = true;
      console.log(`[${now}] Scheduler started (CRON)`);
      try {
        await processUserMappingFeed();
        console.log(
          `[${new Date().toISOString()}] Scheduler completed successfully (CRON)`
        );
      } catch (err) {
        console.error(
          `[${new Date().toISOString()}] Scheduler failed (CRON):`,
          err
        );
      } finally {
        schedulerRunning = false;
      }
    } else {
      console.log(
        `[${now}] Scheduler is already running, skipping this cycle (CRON).`
      );
    }
  });

  console.log(
    `[${new Date().toISOString()}] Scheduler initialized and will run daily at 00:00 (midnight)`
  );
};

// Function to run manually
export const runSchedulerManually = async (triggerSource = "Manual") => {
  const now = new Date().toISOString();
  console.log(`[${now}] Manual trigger requested (${triggerSource})`);

  if (!schedulerRunning) {
    schedulerRunning = true;
    console.log(`[${now}] Scheduler started (${triggerSource})`);
    try {
      await processUserMappingFeed();
      console.log(
        `[${new Date().toISOString()}] Scheduler completed successfully (${triggerSource})`
      );
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Scheduler failed (${triggerSource}):`,
        err
      );
    } finally {
      schedulerRunning = false;
    }
  } else {
    console.log(
      `[${now}] Scheduler is already running, please wait... (${triggerSource})`
    );
  }
};

// Export for manual execution
export { processUserMappingFeed };
