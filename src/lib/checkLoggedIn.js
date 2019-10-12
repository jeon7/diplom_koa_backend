const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.state.user = 401; // Unauthorized
    return;
  }
  return next();
};

export default checkLoggedIn;