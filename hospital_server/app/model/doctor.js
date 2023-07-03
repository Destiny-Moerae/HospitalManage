module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const DoctorSchema = new Schema(
    {
      name: {
        type: String,
        min: 2,
        max: 20,
        match: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
      },
      sex: {
        type: String,
      },
      birth: {
        type: Number,
      },
      idNumber: {
        type: String,
      },
      phone: {
        type: String,
      },
      fee: {
        type: Number,
        default: 0
      },
      description: {
        type: String,
        min: 2,
        max: 200,
        default: "该医生暂无描述"
      },
      surgeryId: {
        type: 'ObjectId',
        ref: 'Surgery',
        required: true,
      },
      createTime: {
        type: Number,
        default: 0,
      },
      updateTime: {
        type: Number,
        default: 0,
      },
    },
    {
      collection: 'doctor',
      versionKey: false,
    }
  )
  return mongoose.model('Doctor', DoctorSchema)
}
