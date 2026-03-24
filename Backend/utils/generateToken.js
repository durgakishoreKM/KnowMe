import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;