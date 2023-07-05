module.exports = {
  // 登录
  userLoginRequest: {
    name: {
      type: 'string',
      required: true,
      description: '用户名',
      example: 'admin',
    },
    password: {
      type: 'string',
      required: true,
      description: '密码',
      example: '123456',
    },
    authority: {
      type: 'number',
      required: true,
      description: '权限',
      example: 1,
    },
  },
};
