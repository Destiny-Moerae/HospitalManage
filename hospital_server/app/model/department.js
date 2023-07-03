module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const DepartmentSchema = new Schema(
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
      collection: 'department',
      versionKey: false,
    }
  );
  return mongoose.model('Department', DepartmentSchema);
};
