import jwt from 'jsonwebtoken';

const setCookie = async (req, res, user, statusCode) => {
  const access_token = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '30s'
  });
  const newRefreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '1d'
  });

  // # This scenario is when user had forgot to logOut but closed his browser tab or session, in that case the cookie remains in browser. But since we are storing the authToken in memory hence on every reload or closing and reopening the tab the cookie will remain, i.e the user refreshToken will remain in DB and since on every logIn we are issuing a refreshToken rotation so we have to check if on the browser any previous user had loggedIn before but forgot to signOut. 

  const { token } = req.cookies;
  if (token)
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true
    });
  const newRefreshTokenArray = user?.refresh_token.filter(rt=>rt!==token);
  
  //Check if newRefreshTokenArray is null before spreading its elements
  user.refresh_token = newRefreshTokenArray ? [...newRefreshTokenArray, newRefreshToken] : [newRefreshToken];
  await user.save();

  return res
    .status(statusCode)
    .cookie('token', newRefreshToken, {
      httpOnly: true,
      sameSite: process.env.MODE === 'DEVELOPMENT' ? 'Lax' : 'None',
      secure: process.env.MODE === 'DEVELOPMENT' ? false : true,
      maxAge: 24 * 60 * 60 * 1000
    })
    .json({
      success: 'true',
      accessToken: access_token
    });
};

export { setCookie };
