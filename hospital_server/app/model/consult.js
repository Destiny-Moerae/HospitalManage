module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ConsultSchema = new Schema(
    {
      date: {
        type: Number,
      },
      startTime: {
        type: Number,
        min: 0,
        max: 23,
      },
      endTime: {
        type: Number,
        min: 0,
        max: 23,
      },
      doctorId: {
        type: 'ObjectId',
        ref: 'Doctor',
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
      collection: 'consult',
      versionKey: false,
    }
  );
  return mongoose.model('Consult', ConsultSchema);
};
