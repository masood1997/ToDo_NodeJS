import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from './error.js';

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader) return next(new ErrorHandler('No authorization headers recieved', 401));
    const token = authHeader.split(' ')[1];
    if (!token) return next(new ErrorHandler('LogIn First', 401));
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded._id);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') next(new ErrorHandler('Token Expired', 401));
  }
};

export const issueAccessToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler('LogIn First', 401));
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true
    });

    const user = await User.findOne({ refresh_token: token });
    if (!user) {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (error, decoded) => {
        if (error) {
          return next(new ErrorHandler('Forbidden', 401));
        }
        console.log('Attempted refresh token reuse!');
        const hackedUser = await User.findById(decoded._id);
        hackedUser.refresh_token = [];
        await hackedUser.save();
      });
      return next(new ErrorHandler('Forbidden', 401));
    }

    // RefreshToken exists in DB and user is found
    const newRefreshTokenArray = user.refresh_token.filter((rt) => rt !== token);

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (error, decoded) => {
      if (error) {
        console.log('Expired refresh token');
        user.refresh_token = newRefreshTokenArray;
        await user.save();
      }
      if (error || decoded._id.toString() !== user._id.toString())
        return next(new ErrorHandler('Invalid/Expired Refresh Token', 401));

      // Refresh Token was still valid
      const access_token = jwt.sign({ _id: decoded._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '30s'
      });
      const newRefreshToken = jwt.sign({ _id: decoded._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

      // Saving refresh token in current user's DB
      user.refresh_token = [...newRefreshTokenArray, newRefreshToken];
      await user.save();

      // Creating new cookies and new accessToken response
      res
        .cookie('token', newRefreshToken, {
          httpOnly: true,
          sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
          secure: process.env.MODE === 'DEVELOPMENT' ? false : true,
          maxAge: 24 * 60 * 60 * 1000
        })
        .json({
          accessToken: access_token
        });
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
