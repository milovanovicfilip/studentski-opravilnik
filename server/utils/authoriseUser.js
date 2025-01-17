export const authoriseUser = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = req.session.user;
  next();
};
