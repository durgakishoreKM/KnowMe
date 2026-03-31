import jwt from "jsonwebtoken";

//
// 🔐 STRICT AUTH (for protected routes)
//
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Token failed" });
  }
};


//
// 🌐 OPTIONAL AUTH (for public routes)
//
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token → allow guest
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }
  
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("OPTIONAL AUTH ERROR:", error.message);

    // Even if token is invalid → don't block
    req.user = null;
    next();
  }
};