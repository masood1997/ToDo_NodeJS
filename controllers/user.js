import User from "../models/user.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/user.js";
import { ErrorHandler } from "../middlewares/error.js";

const getAllUsers = async (req, res, next) => {
  try {
    // This sends only the email on select as mongoose.select sends id also by default so we have to explicitly mention not to send the id
    const users = await User.find().select({ email: 1, _id: 0 });
    res.status(200).json({
      success: "true",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile = (req, res, next) => {
  res.status(200).json({
    success: "true",
    message: {
      email: req.user.email,
      name: req.user.name,
      createdAt: req.user.createdAt,
    },
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");
    if (!user) return next(new ErrorHandler("User not found", 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(new ErrorHandler("Invalid email or Password", 401));

    setCookie(res, user, 200, "Logged In");
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User already exists", 409));

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    setCookie(res, newUser, 201, "Registered Successfully");
  } catch (error) {
    next(error);
  }
};

const logOut = (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      //use expires and not expire as it will create a token with null value also keep in mind to use the format new Date as Date.now wont work
      expires: new Date(Date.now()),
      sameSite : (process.env.MODE === "DEVELOPMENT" ? "Lax" : "None"),
      secure: (process.env.MODE === "DEVELOPMENT" ? false : true)
    })
    .json({
      success: "true",
      message: "Logged Out",
    });
};

export { getMyProfile, login, register, getAllUsers, logOut };
