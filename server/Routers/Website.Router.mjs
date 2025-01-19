import express from "express";
import NewsController from "../Controllers/News.Controller.mjs";
import { Project } from "../Models/Project.Model.mjs";
import { authoriseUser } from "../utils/authoriseUser.js";

const router = express.Router();

router.get("/", NewsController.getNews);

router.get("/list", (req, res) => {
  res.render("list", { title: "Seznam nalog - Študentski opravilnik" });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Pregledna plošča - Študentski opravilnik",
  });
});

router.get("/kanban", (req, res) => {
  res.render("kanban", { title: "Kanban - Študentski opravilnik" });
});

router.get("/calendar", (req, res) => {
  res.render("calendar", {
    title: "Koledar - Študentski opravilnik",
    page: "calendar",
  });
});

router.get('/stats', (req, res) => {
  res.render('stats', { title: 'Statistike - Študentski opravilnik', page: 'stats' });
});

router.get("/settings", authoriseUser, async (req, res) => {
  res.render("settings", {
    title: "Nastavitve - Študentski opravilnik",
    user: req.session.user,
    sessionID: req.sessionID,
    userIP: req.ip,
    lastLogin: req.session.lastLogin || "Ni podatkov",
  });
});

router.get("/profile", (req, res) => {
  res.render("users-profile", { title: "Profil - Študentski opravilnik" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Prijava - Študentski opravilnik" });
});

router.get("/registration", (req, res) => {
  res.render("registration", { title: "Registracija - Študentski opravilnik" });
});

router.get("/projects", (req, res) => {
  res.render("projects", {
    title: "Projekti - Študentski opravilnik",
    userProjects: res.locals.userProjects,
  });
});

router.get("/projects/:id", authoriseUser, async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    const project = await Project.findById(projectId)
      .populate("owner collaborators tasks")
      .exec();

    if (!project) {
      return res.status(404).send("Project Not Found");
    }

    const isOwner = project.owner.id.toString() === userId;
    const isCollaborator = project.collaborators.some(
      (collab) => collab.id.toString() === userId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).send("Access Denied");
    }

    res.render("project", {
      title: `Project - ${project.name}`,
      project,
    });
  } catch (error) {
    console.error("Error rendering project page:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
