import { Project } from "../Models/Project.Model.mjs";

export const fetchUserProjects = async (req, res, next) => {
  if (!req.session.user) {
    res.locals.userProjects = [];
    return next();
  }

  try {
    const userId = req.session.user.id;

    // Fetch projects where the user is the owner or a collaborator
    const projects = await Project.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).select("_id name"); // Only fetch required fields

    res.locals.userProjects = projects;
    next();
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.locals.userProjects = [];
    next();
  }
};
