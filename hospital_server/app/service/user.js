const Service = require('egg').Service

class UserService extends Service {

  async login (params) {
    const { ctx, app } = this
    console.log(params)
    const resUser = await ctx.model.User.findOne({
      name: params.name,
    })


    if (!resUser) {
      return {
        msg: '用户不存在',
        code: 1,
      }
    }

    // 匹配密码
    const isMatch = await ctx.helper.comparePassword(params.password, resUser.password)

    if (!isMatch) {
      return {
        msg: '用户名或密码错误',
        code: 2,
      }
    }

    const token = app.jwt.sign({ ...resUser }, app.config.jwt.secret, {
      expiresIn: '1h',
    })

    ctx.cookies.set('token', token, {
      maxAge: 86400000,
      httpOnly: true,
    })

    return {
      data: {
        token,
        name: resUser.name,
      },
      msg: '登录成功',
      code: 0,
    }
  }

  async logout () {
    const { ctx } = this
    ctx.cookies.set('token', '', {
      maxAge: 0,
    })

    return {
      msg: '退出成功',
    }
  }


  async update (params) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '账户不存在',
      }
    }
    const findItem = await ctx.model.User.findOne({
      _id: params.id,
    })
    if (!findItem) {
      return {
        msg: '账户不存在',
      }
    }

    const updateFields = {
      ...params,
      updateTime: ctx.helper.moment(),
    }

    try {
      await ctx.model.User.updateOne(
        { _id: params.id },
        { $set: updateFields }
      )
    } catch (err) {
      return {
        msg: '账户修改失败',
      }
    }
    return {
      msg: '账户修改成功',
    }
  }
}

module.exports = UserService
