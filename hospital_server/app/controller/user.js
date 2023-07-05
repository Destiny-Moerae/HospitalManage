'use strict';

const { Controller } = require('egg');
/**
 * @Controller 登录管理
 */
class LoginController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.loginRole = {
      name: {
        type: 'string',
        min: 2,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
      },
      password: {
        type: 'password',
        min: 6,
        max: 20,
        format: /^[A-Za-z0-9_]{6,20}$/,
      },
      authority: {
        type: 'number',
        required: true,
        format: /^([0-1])$/,
      },
    };
  }

  /**
   * @summary 登录
   * @description 用户输入用户名和密码进行登录
   * @router post /api/v1/user/login
   * @request body userLoginRequest *body
   */
  async login() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    console.log('data', data);
    ctx.validate(this.loginRole, data);
    const res = await service.user.login(data);
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 退出
   * @description 用户退出
   * @router post /api/v1/user/logout
   */
  async logout() {
    const { ctx, service } = this;
    const res = await service.user.logout();
    ctx.helper.success({ ctx, res });
  }
}

module.exports = LoginController;
