module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SurgerySchema = new Schema(
    {
      name: {
        type: String,
        min: 2,
        max: 20,
        match: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
      },
      description: {
        type: String,
        min: 2,
        max: 200,
        default: "该诊室暂无描述"
      },
      departmentId: {
        type: 'ObjectId',
        ref: 'Department',
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
      collection: 'surgery',
      versionKey: false,
    }
  );
  return mongoose.model('Surgery', SurgerySchema);
};
