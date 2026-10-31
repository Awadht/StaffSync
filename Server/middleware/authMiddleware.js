const jwt = require("jsonwebtoken");

// CHECK LOGIN / JWT
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};


// CHECK USER ROLE
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("AUTH CHECK:", req.user, "ALLOWED:", allowedRoles);

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission."
      });
    }

    next();
  };
};


// EXPORT BOTH FUNCTIONS
module.exports = {
  protect,
  authorize
};