'use strict'

const { Controller } = require('egg')

class LoginController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.loginRole = {
      userName: {
        type: 'string',
        min: 5,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{5,20}$/,
      },
      password: {
        type: 'password',
        // compare: 're-password',
        min: 6,
        max: 20,
        format: /^[A-Za-z0-9_]{6,20}$/,
      },
    }
  }
  async index () {
    const { ctx } = this
    const data = ctx.request.body
    console.log('data', data)
    ctx.validate(this.loginRole, data)
    const res = await ctx.service.login.index(data)
    ctx.helper.success({ ctx, res })
  }
}

module.exports = LoginController
