import { Task } from "../Models/Task.Model.mjs";
import { Project } from "../Models/Project.Model.mjs";
import multer from "multer";
import fs from "fs";
import { Parser } from "json2csv";
import csvParser from "csv-parser";

const upload = multer({ dest: "uploads/" });
export default class TaskController {
  constructor() {}

  createTask = async (req, res) => {
    try {
      const { title, content, status, priority, dueDate, tags, project } =
        req.body;

      if (!title) {
        return res.status(400).json({ message: "Task title is required." });
      }

      const newTask = await Task.create({
        title,
        content,
        status,
        priority,
        dueDate,
        tags,
        project: project || null,
        user: req.user.id,
      });

      if (project) {
        const proj = await Project.findById(project);
        if (proj) {
          proj.tasks.push(newTask.id);
          await proj.save();
        }
      }

      const processedTask = calculateTaskStatus(newTask);
      await Task.findByIdAndUpdate(newTask.id, processedTask, { new: true });

      res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({
        message: "Failed to create task",
        error: error.message,
      });
    }
  };

  getAllTasks = async (req, res) => {
    try {
      let filter = {};

      if (req.query.project) {
        const projectId = req.query.project;
        const project = await Project.findById(projectId);

        if (!project) {
          return res.status(404).json({ message: "Project not found." });
        }

        const userId = req.user.id;
        const isOwner = project.owner.toString() === userId;
        const isCollaborator = project.collaborators.some(
          (collab) => collab.toString() === userId
        );

        if (!isOwner && !isCollaborator) {
          return res
            .status(403)
            .json({ message: "Access denied to this project." });
        }

        filter.project = projectId;
      } else {
        const accessibleProjects = await Project.find({
          $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
        })
          .select("id")
          .lean()
          .exec();

        const accessibleProjectIds = accessibleProjects.map((p) => p.id);

        filter.$or = [
          { user: req.user.id },
          { project: { $in: accessibleProjectIds } },
        ];
      }

      const tasks = await Task.find(filter).populate("user project").exec();

      const updatedTasks = tasks.map((task) => calculateTaskStatus(task));

      await Promise.all(updatedTasks.map((task) => task.save()));

      res.status(200).json(updatedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({
        message: "Failed to fetch tasks",
        error: error.message,
      });
    }
  };

  getTaskById = async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id).populate("user project").exec();

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      const userId = req.user.id;
      const isOwner = task.user.id.toString() === userId;
      let isCollaborator = false;

      if (task.project) {
        const project = await Project.findById(task.project);
        if (project) {
          isCollaborator = project.collaborators.some(
            (collab) => collab.toString() === userId
          );
        }
      }

      if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Access denied." });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error("Error retrieving task:", error);
      res.status(400).json({
        message: "Failed to retrieve task",
        error: error.message,
      });
    }
  };

  updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      // Authorization: Ensure the user has access to update this task
      if (
        task.user.toString() !== req.user.id &&
        (!task.project ||
          !(await Project.findOne({
            id: task.project,
            $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
          })))
      ) {
        return res.status(403).json({ message: "Access denied." });
      }

      // If the project is being changed, update the old and new projects accordingly
      if (
        updateData.project &&
        updateData.project !== task.project?.toString()
      ) {
        // Remove task from old project
        if (task.project) {
          await Project.findByIdAndUpdate(task.project, {
            $pull: { tasks: id },
          });
        }

        // Add task to new project
        const newProject = await Project.findById(updateData.project);
        if (newProject) {
          newProject.tasks.push(id);
          await newProject.save();
        }

        task.project = updateData.project;
      }

      // Update other task fields
      if (updateData.title !== undefined) task.title = updateData.title;
      if (updateData.content !== undefined) task.content = updateData.content;
      if (updateData.status !== undefined) task.status = updateData.status;
      if (updateData.priority !== undefined)
        task.priority = updateData.priority;
      if (updateData.dueDate !== undefined) task.dueDate = updateData.dueDate;
      if (updateData.tags !== undefined) task.tags = updateData.tags;

      // Recalculate task status
      const processedTask = calculateTaskStatus(task);
      await Task.findByIdAndUpdate(id, processedTask, { new: true });

      await task.populate("user project");

      res.status(200).json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({
        message: "Failed to update task",
        error: error.message,
      });
    }
  };

  deleteTask = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found." });
      }

      // If the task is associated with a project, remove it from the project's tasks array
      if (deletedTask.project) {
        await Project.findByIdAndUpdate(deletedTask.project, {
          $pull: { tasks: id },
        });
      }

      res.status(200).json({ message: "Task deleted successfully." });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(400).json({
        message: "Failed to delete task",
        error: error.message,
      });
    }
  };

  exportToCSV = async (request, response) => {
    try {
      const tasks = await Task.find({ userId: request.user.id });

      const formattedTasks = tasks.map((task) => ({
        title: task.title,
        content: task.content,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        tags: task.tags.join(";"),
      }));

      const fields = [
        "title",
        "content",
        "status",
        "priority",
        "dueDate",
        "createdAt",
        "tags",
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(formattedTasks);

      response.header("Content-Type", "text/csv");
      response.attachment(`tasks_${Date.now()}_${request.user.id}`);
      response.send(csv);
    } catch (error) {
      response.status(500).json({
        message: "Error with exporting to CSV",
        error: error.message,
      });
    }
  };

  importFromCSV = async (request, response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const tasks = [];

      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (row) => {
          const task = {
            title: row.title,
            content: row.content,
            status: row.status,
            priority: row.priority,
            dueDate: row.dueDate,
            createdAt: row.createdAt,
            tags: row.tags.join(";"),
          };
          tasks.push(task);
        })
        .on("end", async () => {
          try {
            const createdTasks = await Task.insertMany(tasks);

            return res.status(201).json({
              message: "Tasks created successfully",
              tasks: createdTasks,
            });
          } catch (error) {
            return res.status(500).json({
              message: "Error while inserting tasks into the database",
              error: error.message,
            });
          }
        })
        .on("error", (error) => {
          return res.status(400).json({
            message: "Error with importing from CSV",
            error: error.message,
          });
        });
    } catch (error) {
      response.status(500).json({
        message: "Error with importing from CSV",
        error: error.message,
      });
    }
  };
  searchTasks = async (request, response) => {
    try {
      const { title } = request.params;

      const tasks = await Task.find({ title: new RegExp(title, "i") });

      response.status(200).json(tasks);
    } catch (error) {
      response.status(400).json({
        message: "Failed to search tasks",
        error: error.message,
      });
    }
  };
}

function calculateTaskStatus(task) {
  const now = new Date();
  const dueDate = new Date(task.dueDate);

  task.warning =
    !task.overdue &&
    dueDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000) &&
    dueDate >= now;
  task.overdue = dueDate < now && task.status !== "completed";

  return task;
}
