import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Študentski opravilnik" });
});

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

router.get("/settings", (req, res) => {
  res.render("settings", { title: "Nastavitve - Študentski opravilnik" });
});

router.get("/users-profile", (req, res) => {
  res.render("users-profile", { title: "Profil - Študentski opravilnik" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Prijava - Študentski opravilnik" });
});

router.get("/registration", (req, res) => {
  res.render("registration", { title: "Registracija - Študentski opravilnik" });
});

export default router;
