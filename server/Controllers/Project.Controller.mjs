// Controllers/Project.Controller.mjs

import { Project } from "../Models/Project.Model.mjs";
import { Task } from "../Models/Task.Model.mjs";

export default class ProjectController {
  constructor() {}

  // Create a new project
  createProject = async (req, res) => {
    try {
      console.log("Authenticated user for project creation:", req.user); // Debugging

      const { name, description, collaborators } = req.body;

      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: "Project name is required." });
      }

      const project = await Project.create({
        name,
        description,
        owner: req.user.id, // Assign the authenticated user as the owner
        collaborators: collaborators || [],
      });

      console.log("Project created successfully:", project); // Debugging

      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error); // Debugging
      res.status(400).json({
        message: "Failed to create project",
        error: error.message,
      });
    }
  };

  // Get all projects accessible by the user
  getAllProjects = async (req, res) => {
    try {
      const projects = await Project.find({
        $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
      }).populate("owner collaborators tasks");

      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error); // Debugging
      res.status(500).json({
        message: "Failed to fetch projects",
        error: error.message,
      });
    }
  };

  // Get a specific project by ID
  getProjectById = async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id)
        .populate("owner collaborators tasks")
        .exec();

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      // Check if the user is the owner or a collaborator
      const isOwner = project.owner.id.toString() === req.user.id;
      const isCollaborator = project.collaborators.some(
        (collaborator) => collaborator.id.toString() === req.user.id
      );

      if (!isOwner && !isCollaborator) {
        return res.status(403).json({ message: "Access denied." });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error("Error retrieving project:", error); // Debugging
      res.status(400).json({
        message: "Failed to retrieve project",
        error: error.message,
      });
    }
  };

  // Update a project by ID
  updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      if (project.owner.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Only the owner can update the project." });
      }

      // Update project fields
      if (updateData.name !== undefined) project.name = updateData.name;
      if (updateData.description !== undefined)
        project.description = updateData.description;
      if (updateData.collaborators !== undefined)
        project.collaborators = updateData.collaborators;

      project.updatedAt = Date.now();

      await project.save();
      await project.populate("owner collaborators tasks");

      res.status(200).json(project);
    } catch (error) {
      console.error("Error updating project:", error); // Debugging
      res.status(400).json({
        message: "Failed to update project",
        error: error.message,
      });
    }
  };

  // Delete a project by ID
  deleteProject = async (req, res) => {
    try {
      const { id } = req.params;

      // Option 1: Using findByIdAndDelete
      const project = await Project.findByIdAndDelete(id);

      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
      console.error("Error deleting project:", error); // Debugging
      res.status(400).json({
        message: "Failed to delete project",
        error: error.message,
      });
    }
  };

  // Add a task to a project
  addTaskToProject = async (req, res) => {
    try {
      const { projectId, taskId } = req.body;

      if (!projectId || !taskId) {
        return res.status(400).json({
          message: "Both projectId and taskId are required.",
        });
      }

      const project = await Project.findById(projectId);
      const task = await Task.findById(taskId);

      if (!project || !task) {
        return res.status(404).json({ message: "Project or Task not found." });
      }

      const isOwner = project.owner.toString() === req.user.id;
      const isCollaborator = project.collaborators.includes(req.user.id);

      if (!isOwner && !isCollaborator) {
        return res.status(403).json({
          message: "You do not have permission to add tasks to this project.",
        });
      }

      if (project.tasks.includes(taskId)) {
        return res
          .status(400)
          .json({ message: "Task already added to the project." });
      }

      project.tasks.push(taskId);
      await project.save();
      await project.populate("owner collaborators tasks");

      res.status(200).json(project);
    } catch (error) {
      console.error("Error adding task to project:", error); // Debugging
      res.status(400).json({
        message: "Failed to add task to project",
        error: error.message,
      });
    }
  };
}
