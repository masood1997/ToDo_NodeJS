import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { setCookie } from '../utils/user.js';
import { ErrorHandler } from '../middlewares/error.js';

const getAllUsers = async (req, res, next) => {
  try {
    // This sends only the email on select as mongoose.select sends id also by default so we have to explicitly mention not to send the id
    const users = await User.find().select({ email: 1, _id: 0 });
    res.status(200).json({
      success: 'true',
      users
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = (req, res, next) => {
  res.status(200).json({
    success: 'true',
    message: {
      user: req.user
    }
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select('+password');
    if (!user) return next(new ErrorHandler('User not found', 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler('Invalid email or Password', 401));

    setCookie(req, res, user, 200);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) return next(new ErrorHandler('User already exists', 409));

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    setCookie(req, res, newUser, 201);
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new ErrorHandler('Need to be loggedin for Logout', 200));

  // Is refreshToken in DB?
  const user = await User.findOne({ refresh_token: token });
  if (!user) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true
    });
    return next(new ErrorHandler('Need to be loggedin for Logout', 200));
  }

  // Delete refreshToken in DB
  const newRefreshTokenArray = user.refresh_token.filter((rt) => rt !== token);
  user.refresh_token = newRefreshTokenArray;
  await user.save();
  res
    .status(200)
    .clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true
    })
    .json({
      success: 'true',
      message: 'Logged Out'
    });
};

export { getMyProfile, login, register, getAllUsers, logOut };
