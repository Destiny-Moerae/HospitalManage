'use strict'

const Service = require('egg').Service

class ConsultService extends Service {

  async index (params) {
    const { app, ctx } = this
    const page = parseInt(params.page, 10) || 1
    const pageSize = parseInt(params.pageSize, 10) || 20
    if (params.doctorId && !app.mongoose.Types.ObjectId.isValid(params.doctorId)) {
      return {
        msg: '参数错误',
        code: 1
      }
    }
    const necessaryCon = {
      ...(params.doctorId && { doctorId: params.doctorId }),
    }

    let fuzzyCon = {}
    if (params.date) {
      fuzzyCon.date = { "$eq": params.date }
    }
    if (params.time) {
      fuzzyCon = {
        ...fuzzyCon,
        "$and": [
          { "startTime": { "$lte": params.time } },
          { "endTime": { "$gt": params.time } }
        ]
      }
    }


    const query = {
      $and: [
        necessaryCon,
        fuzzyCon,
      ],
    }
    // console.log('query', query);
    const countPromise = ctx.model.Consult.countDocuments(query)
    // const listPromise = ctx.model.Consult
    //   .find(query)
    //   .sort({ createTime: -1 })
    //   .skip((page - 1) * pageSize)
    //   .limit(pageSize)
    //   .populate('doctorId', 'name')
    //   .lean()
    //   .exec();


    const listPromise = ctx.model.Consult.aggregate([
      { $match: query },
      { $sort: { createTime: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'doctor',
          localField: 'doctorId',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      {
        $addFields: {
          doctorName: { $arrayElemAt: ['$doctor.fullname', 0] },
        },
      },
      {
        $lookup: {
          from: 'surgery',
          localField: 'doctor.surgeryId',
          foreignField: '_id',
          as: 'surgery'
        }
      },
      {
        $addFields: {
          surgeryName: { $arrayElemAt: ['$surgery.name', 0] }
        }
      },
      {
        $project: {
          doctor: 0,

          surgery: 0
        }
      }
    ])

    const [totalCount, list] = await Promise.all([countPromise, listPromise])
    const modifiedList = list.map(item => {
      return {
        ...item,
        date: item.date * 1000,
        startTime: item.startTime.toString(),
        endTime: item.endTime.toString()
      }
    })
    return {
      data: {
        page,
        pageSize,
        totalCount,
        list: modifiedList
      },
    }
  }

  async create (params) {
    const { ctx } = this
    params.startTime = parseInt(params.startTime, 10) || -1
    params.endTime = parseInt(params.endTime, 10) || -1
    if (params.startTime === -1 || params.endTime === -1) {
      return {
        msg: '时间错误',
        code: 1
      }
    }
    if (params.startTime < 0 || params.startTime > 23 || params.endTime < 0 || params.endTime > 23) {
      return {
        msg: '时间错误',
        code: 1
      }
    }
    if (params.startTime >= params.endTime) {
      return {
        msg: '时间错误',
        code: 1
      }
    }
    if (!params.doctorId) {
      return {
        msg: '缺少医生id',
        code: 1
      }
    }
    const findDoctor = await ctx.model.Doctor.findOne({ _id: params.doctorId })
    if (!findDoctor) {
      return {
        msg: '医生不存在',
        code: 1
      }
    }
    // console.log("params-service", params)
    const findItems = await ctx.model.Consult.find({
      _id: { $ne: params.id },
      doctorId: params.doctorId
    })

    // console.log("findItems", findItems)
    const newItem = {
      doctorId: params.doctorId,
      date: params.date,
      startTime: params.startTime,
      endTime: params.endTime,
      createTime: ctx.helper.moment(),
    }
    if (findItems.length > 0) {
      let isConflict = false

      for (let i = 0; i < findItems.length; i++) {
        const findItem = findItems[i]

        if (
          findItem.date !== params.date ||
          params.endTime <= findItem.startTime ||
          params.startTime >= findItem.endTime
        ) {
          // 发现时间冲突
          continue
        }
        else {
          isConflict = true
          break
        }
      }

      if (!isConflict) {
        const res = await ctx.model.Consult.create(newItem)
        return {
          msg: '出诊添加成功',
          data: res,
        }
      } else {
        return {
          msg: '出诊时间冲突',
          code: 1
        }
      }
    }
    const res = await ctx.model.Consult.create(newItem)
    return {
      msg: '出诊添加成功',
      data: res,
    }

  }

  async update (params) {
    const { ctx, app } = this
    params.startTime = parseInt(params.startTime, 10) || -1
    params.endTime = parseInt(params.endTime, 10) || -1
    if (params.startTime === -1 || params.endTime === -1) {
      return {
        msg: '时间错误',
        code: 1
      }
    }
    if (params.startTime < 0 || params.startTime > 23 || params.endTime < 0 || params.endTime > 23) {
      return {
        msg: '时间错误',
        code: 1
      }
    }
    if (params.startTime >= params.endTime) {
      return {
        msg: '时间错误',
        code: 1
      }
    }
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '出诊不存在',
        code: 1
      }
    }
    const item = await ctx.model.Consult.findOne({
      _id: params.id,
    })
    if (!item) {
      return {
        msg: '出诊不存在',
        code: 1
      }
    }



    const isConflict = await ctx.model.Consult.findOne({
      _id: { $ne: params.id },
      doctorId: params.doctorId,
      endTime: { $gt: params.startTime },
      startTime: { $lt: params.endTime }

    })

    // const findItems = await ctx.model.Consult.find({
    //   _id: { $ne: params.id },
    //   doctorId: params.doctorId
    // })
    // if (findItems.length > 0) {
    //   let isConflict = false

    //   for (let i = 0; i < findItems.length; i++) {
    //     const findItem = findItems[i]

    //     if (
    //       findItem.date !== params.date ||
    //       params.endTime <= findItem.startTime ||
    //       params.startTime >= findItem.endTime
    //     ) {
    //       // 发现时间冲突
    //       continue
    //     }
    //     else {
    //       isConflict = true
    //       break
    //     }
    //   }

    if (isConflict) {
      // 时间冲突处理逻辑
      return {
        msg: "时间冲突",
        code: 1
      }
    } else {
      // 修改出诊时间
      const updateFields = {
        ...params,
        updateTime: ctx.helper.moment(),
      }
      try {
        await ctx.model.Consult.updateOne(
          { _id: params.id },
          { $set: updateFields }
        )
      } catch (err) {
        // console.log(err);
        return {
          msg: '出诊修改失败',
          code: 1
        }
      }
      return {
        msg: '出诊修改成功',
      }
    }
  }

  async delete (id) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(id)) {
      return {
        msg: '出诊不存在',
        code: 1
      }
    }
    const delItem = await ctx.model.Consult.findOne({
      _id: id,
    })
    if (!delItem) {
      return {
        msg: '出诊不存在',
        code: 1
      }
    }

    try {

      await ctx.model.Consult.deleteOne({
        _id: id,
      })
    } catch (err) {
      return {
        msg: '出诊删除失败',
        code: 1
      }
    }
    return {
      msg: '出诊删除成功',
    }
  }

}

module.exports = ConsultService
