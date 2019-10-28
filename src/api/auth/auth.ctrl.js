import Joi from 'joi'; // to check request body obj for db data type
import User from '../../models/user';

/*
  POST /api/auth/register
  {
    username: 'gukhwa123'
    password: '1234567'
  }
*/
export const register = async ctx => {
  // Request Body condition for user account
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(2)
      .max(20)
      .required(),
    password: Joi.string().required()
  });
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }

    const user = new User({
      username,
    })
    await user.setPassword(password);
    await user.save();

    // responding data, delete hashedPassword
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      httpOnly: true
    });

  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/auth/login
  {
    username: 'gukhwa123'
    password: '1234567'
  }
*/
export const login = async ctx => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 401; // Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      httpOnly: true
    });

  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/auth/check
*/
export const check = async ctx => {
  try {
    const user = await User.findByUsername(ctx.state.user.username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  POST /api/auth/logout
*/
export const logout = async ctx => {
  ctx.cookies.set('access_token'); // remove jwt token
  ctx.status = 204; // No Content

};
