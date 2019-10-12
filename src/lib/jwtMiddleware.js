import jwt from 'jsonwebtoken';
import User from '../models/user';

// to get jwt token from user and verify
// to reissue token
const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username
    };

    // reissue token if existed token expires in 3.5 days
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
      });
    }

    return next();
  } catch (e) {
    return next();
  }
}

export default jwtMiddleware;