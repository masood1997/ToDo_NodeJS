import jwt from "jsonwebtoken";

const setCookie = (res, user, statusCode, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      sameSite : (process.env.MODE === "DEVELOPMENT" ? "Lax" : "None"),
      secure: (process.env.MODE === "DEVELOPMENT" ? false : true),
      maxAge: 15 * 60 * 1000,
    })
    .json({
      success: "true",
      message: message,
    });
};

export { setCookie };
