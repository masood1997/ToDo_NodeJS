import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from './error.js';

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization
    if (!authHeader) return next(new ErrorHandler('No authorization headers recieved', 401));
    const token = authHeader.split(' ')[1];
    if (!token) return next(new ErrorHandler('LogIn First', 401));
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    if(error.name === "TokenExpiredError" ) next(new ErrorHandler('Token Expired', 401))
  }
};

export const issueAccessToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler('LogIn First', 401));
    const user = await User.findOne({ refresh_token: token });
    if (!user) return next(new ErrorHandler('Forbidden', 403));
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const decodedUser = await User.findById(decoded._id);
    if (user.email !== decodedUser.email) return next(new ErrorHandler('Invalid Refresh Token', 403));
    const access_token = jwt.sign({ _id: decodedUser._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '300s'
    });
    res.json({
      accessToken: access_token
    });
  } catch (error) {
    next(error);
  }
};

export const isAuthorized = (roles) => {
  return (req, res, next) => {
    const result = roles.includes(req.user.role);
    if (!result) return next(new ErrorHandler(`Role ${req.user.role} is not authorized to access this resource`, 403));
    next();
  };
};

export default isAuthenticated;
