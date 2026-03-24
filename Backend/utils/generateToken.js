import jwt from "jsonwebtoken";

const generateToken = (userData) => {
  return jwt.sign(
    {
      id: userData.id,
      username: userData.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;