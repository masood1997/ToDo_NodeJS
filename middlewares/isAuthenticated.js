import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "./error.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler("LogIn First", 401));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticated;
