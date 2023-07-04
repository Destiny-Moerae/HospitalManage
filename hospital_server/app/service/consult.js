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
          doctorName: { $arrayElemAt: ['$doctor.name', 0] },
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
          doctorId: 0,
          surgery: 0
        }
      }
    ])
    const [totalCount, list] = await Promise.all([countPromise, listPromise])
    return {
      data: {
        page,
        pageSize,
        totalCount,
        list,
      },
    }
  }

  async create (params) {
    const { ctx } = this
    if (!params.doctorId) {
      return {
        msg: '缺少医生id',
      }
    }
    // console.log("params-service", params)
    const findItems = await ctx.model.Consult.find({ doctorId: params.doctorId })

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
          findItem.date === params.date &&
          findItem.endTime > params.startTime &&
          findItem.startTime < params.endTime
        ) {
          // 发现时间冲突
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
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '出诊不存在',
      }
    }
    const findItem = await ctx.model.Consult.findOne({
      _id: params.id,
    })
    if (!findItem) {
      return {
        msg: '出诊不存在',
      }
    }

    const conflictingSurgery = await ctx.model.Surgery.findOne({
      _id: { $ne: params.id },
      doctorId: params.doctorId,
      $or: [
        {
          startTime: { $lt: params.endTime },
          endTime: { $gt: params.startTime }
        },
        {
          startTime: { $eq: params.startTime },
          endTime: { $eq: params.endTime }
        }
      ]
    })

    if (conflictingSurgery) {
      // 时间冲突处理逻辑
      return {
        msg: "时间冲突"
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
      }
    }
    const delItem = await ctx.model.Consult.findOne({
      _id: id,
    })
    if (!delItem) {
      return {
        msg: '出诊不存在',
      }
    }

    try {

      await ctx.model.Consult.deleteOne({
        _id: id,
      })
    } catch (err) {
      return {
        msg: '出诊删除失败',
      }
    }
    return {
      msg: '出诊删除成功',
    }
  }

}

module.exports = ConsultService
