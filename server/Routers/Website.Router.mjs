import express from "express";
import NewsController from "../Controllers/News.Controller.mjs";
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

router.get('/calendar', (req, res) => {
  res.render('calendar', { title: 'Koledar - Študentski opravilnik', page: 'calendar' });
});

router.get("/settings", authoriseUser, async (req, res) => {
  res.render("settings", {
    title: "Nastavitve - Študentski opravilnik",
    user: req.session.user,
    sessionID: req.sessionID,
    userIP: req.ip,
    lastLogin: req.session.lastLogin || "Ni podatkov"
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

export default router;
