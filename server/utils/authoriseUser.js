export const authoriseUser = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    console.log("Unauthorized access attempt.");
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  // Assign the session user to req.user for easy access in controllers
  req.user = req.session.user;
  console.log(`Authenticated user: ${req.user.username}`);
  next(); // Proceed to the next middleware or route handler
};
