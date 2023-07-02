const Service = require("egg").Service

class UserService extends Service {

  async index (params) {
    const { ctx, app } = this
    console.log(params)
    const resUser = await ctx.model.User.findOne({
      userName: params.userName,
    })


    if (!resUser) {
      return {
        msg: "用户不存在",
        code: 1
      }
    }

    // 匹配密码
    const isMatch = await ctx.helper.comparePassword(params.password, resUser.password)

    if (!isMatch) {
      return {
        msg: "用户名或密码错误",
        code: 2
      }
    }

    const token = app.jwt.sign({ ...resUser }, app.config.jwt.secret, {
      expiresIn: "1h",
    })

    ctx.cookies.set("token", token, {
      maxAge: 86400000,
      httpOnly: true,
    })

    return {
      data: {
        token,
        userName: resUser.userName,
      },
      msg: "登录成功",
      code: 0
    }
  }
  // async userLogout () {
  //   const { ctx } = this
  //   ctx.cookies.set("token", "", {
  //     maxAge: 0,
  //   })

  //   return {
  //     msg: "退出成功",
  //   }
  // }
}

module.exports = UserService
