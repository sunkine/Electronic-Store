import jwt from "jsonwebtoken";

export const generateAccessToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
};

export const generateRefreshToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" });
};

export default { generateAccessToken, generateRefreshToken };
