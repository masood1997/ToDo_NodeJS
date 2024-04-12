import jwt from 'jsonwebtoken';

const setCookie = async (res, user, statusCode, message) => {
  const access_token = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '300s'
  });
  const refresh_token = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
  user.refresh_token = refresh_token;
  await user.save();

  return res
    .status(statusCode)
    .cookie('token', refresh_token, {
      httpOnly: true,
      sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({
      success: 'true',
      accessToken: access_token
    });
};

export { setCookie };
