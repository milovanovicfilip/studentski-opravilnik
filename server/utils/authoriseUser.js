export const authoriseUser = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  // Set req.user to the authenticated user
  req.user = req.session.user;
  next(); // Proceed to the next middleware or route handler
};
