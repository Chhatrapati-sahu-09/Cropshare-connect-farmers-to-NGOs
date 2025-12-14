import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });

  // Store the token in an HTTP-Only cookie (more secure than localStorage)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // Allow non-HTTPS in development
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;
