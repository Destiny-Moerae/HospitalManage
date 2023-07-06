module.exports = () => {
  return async function checkAdmin(ctx, next) {
    // console.log('ctx.state.user', ctx.state.user._doc);
    const user = ctx.state.user._doc;
    if (user.authority === 1) {
      // 是管理员角色，允许访问高权限路由
      await next();
    } else {
      ctx.throw(403, '权限不足');
    }
  };
};
