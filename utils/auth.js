const withAuth = (req, res, next) => {
  // If the user is not logged in, clear the session and redirect to the login route
  if (!req.session.logged_in) {
      req.session.destroy(() => {
          res.redirect('/login');
      });
  } else {
      // If the user is logged in, allow the request to continue to the next middleware or route handler
      next();
  }
};

module.exports = withAuth;
