'use strict';

module.exports = () => {
  return async function handleLogin(ctx, next) {
    const { user } = ctx.session;

    if (user && user.id) {
      await next();
    } else {
      const { path } = ctx.request;
      ctx.body = { success: false, message: `未登录不允许访问【${path}】` };
    }
  };
};
