import { Project } from "../Models/Project.Model.mjs";
import { Task } from "../Models/Task.Model.mjs";

export default class ProjectController {
  constructor() {}

  createProject = async (req, res) => {
    try {
      const { name, description, collaborators } = req.body;
      const project = await Project.create({
        name,
        description,
        owner: req.user._id, // Assuming user is authenticated
        collaborators: collaborators || [],
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({
        message: "Failed to create project",
        error: error.message,
      });
    }
  };

  getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find({
        $or: [{ owner: req.user._id }, { collaborators: req.user._id }],
      }).populate("owner collaborators tasks");
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch projects",
        error: error.message,
      });
    }
  };

  getProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id)
        .populate("owner collaborators tasks")
        .exec();

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (
        project.owner.toString() !== req.user._id &&
        !project.collaborators.includes(req.user._id)
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({
        message: "Failed to retrieve project",
        error: error.message,
      });
    }
  };

  updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "Only the owner can update the project" });
      }

      const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("owner collaborators tasks");

      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(400).json({
        message: "Failed to update project",
        error: error.message,
      });
    }
  };

  deleteProject = async (req, res) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "Only the owner can delete the project" });
      }

      await project.remove();
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(400).json({
        message: "Failed to delete project",
        error: error.message,
      });
    }
  };

  addTaskToProject = async (req, res) => {
    try {
      const { projectId, taskId } = req.body;

      const project = await Project.findById(projectId);
      const task = await Task.findById(taskId);

      if (!project || !task) {
        return res.status(404).json({ message: "Project or Task not found" });
      }

      project.tasks.push(taskId);
      await project.save();

      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({
        message: "Failed to add task to project",
        error: error.message,
      });
    }
  };
}
