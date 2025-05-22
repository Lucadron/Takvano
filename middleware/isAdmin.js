module.exports = function (req, res, next) {
    if (req.user && req.user.rol === "Admin") {
      return next();
    }
    return res.redirect("/dashboard");
  };
  