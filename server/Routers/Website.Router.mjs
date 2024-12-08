import express from "express";
import { injectUser } from "../utils/jwt.js";

const router = express.Router();

router.use(injectUser);

router.get("/", (req, res) => {
  res.render("index", { title: "Študentski opravilnik" });
});

router.get("/list", (req, res) => {
  res.render("list", { title: "Seznam nalog - Študentski opravilnik" });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Pregledna plošča - Študentski opravilnik",
    user: res.locals.user,
  });
});

router.get("/kanban", (req, res) => {
  res.render("kanban", { title: "Kanban - Študentski opravilnik" });
});

router.get("/calendar", (req, res) => {
  res.render("calendar", { title: "Koledar - Študentski opravilnik" });
});

router.get("/settings", (req, res) => {
  res.render("settings", { title: "Nastavitve - Študentski opravilnik" });
});

router.get("/users-profile", (req, res) => {
  res.render("users-profile", { title: "Profil - Študentski opravilnik" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
