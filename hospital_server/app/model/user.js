const helper = require('../extend/helper')
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    name: { type: String },
    password: { type: String },
    authority: { type: Number },
  }, {
    collection: 'user',
    versionKey: false,
  })

  const UserModel = mongoose.model('User', UserSchema)
  // 开始时预设一个管理员账户
  const user = {
    name: 'admin',
    password: '123456',
    authority: 1,
  }
  // 加密密码后创建
  helper.getSaltPassword(user.password).then(async hash => {
    user.password = hash
    const resUser = await UserModel.find({ name: user.name })
    if (resUser.length === 0) {
      UserModel.create(user)
    }
  })
  return UserModel

};

