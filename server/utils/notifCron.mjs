import cron from "node-cron";
import { Task } from "../Models/Task.Model.mjs";
import { Notification } from "../Models/Notification.Model.mjs";

// vsak dan ob polnoči preverja zapadlost rokov in razpošlje obvestila
cron.schedule("0 0 * * *", async () => {
  console.log("Cron job started: Checking deadlines");

  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await Task.find({ dueDate: { $gte: now, $lt: tomorrow } });

    for (const task of tasks) {
      const existingNotification = await Notification.findOne({ taskId: task._id });
      if (!existingNotification) {
        const message = `Naloga ${task.title}" bo kmalu potekla. Rok: ${task.dueDate}`;
        await Notification.create({ taskId: task._id, message });
        console.log(`Notification created for task: ${task.title}`);
      }
    }
  } catch (error) {
    console.error("Cron job failed:", error.message);
  }

  console.log("Cron job completed");
});

