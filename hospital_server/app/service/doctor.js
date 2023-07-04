'use strict'

const Service = require('egg').Service

class DoctorService extends Service {

  async index (params) {
    const { ctx } = this

    const page = parseInt(params.page, 10) || 1
    const pageSize = parseInt(params.pageSize, 10) || 20
    const necessaryCon = {
      ...(params.surgeryId && { surgeryId: params.surgeryId }),
    }

    const fuzzyCon = params.name ? { name: new RegExp(params.name, 'i') } : {}

    const userIdCon = params.userId ? { userId: params.userId } : {}
    const query = {
      $and: [
        necessaryCon,
        fuzzyCon,
        userIdCon
      ],
    }
    const listPromise = ctx.model.Doctor.aggregate([
      { $match: query },
      { $sort: { createTime: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'surgery',
          localField: 'surgeryId',
          foreignField: '_id',
          as: 'surgery',
        },
      },
      {
        $addFields: {
          surgeryName: { $arrayElemAt: ['$surgery.name', 0] },
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          name: { $arrayElemAt: ['$user.name', 0] },
        },
      },
      {
        $addFields: {
          password: { $arrayElemAt: ['$user.password', 0] },
        },
      },
      {
        $project: {
          surgery: 0,
          authority: 0,
          user: 0
        },
      },

    ])
    const countPromise = ctx.model.Doctor.countDocuments(query)
    // const listPromise = ctx.model.Doctor
    //   .find(query)
    //   .sort({ createTime: -1 })
    //   .skip((page - 1) * pageSize)
    //   .limit(pageSize)
    //   .populate('surgeryId')
    //   .lean()
    //   .exec()
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
    if (!params.surgeryId) {
      return {
        msg: '缺少诊室id',
      }
    }
    if (!app.mongoose.Types.ObjectId.isValid(params.surgeryId)) {
      return {
        msg: '诊室不存在',
      }
    }
    const findSurgery = await ctx.model.Surgery.findOne({
      _id: params.surgeryId,
    })
    if (!findSurgery) {
      return {
        msg: '诊室不存在',
      }
    }

    //创建医生的时候同时创建一个用户
    const user = await ctx.model.User.create({
      name: params.name,
      password: params.password,
      authority: 0
    })
    const newItem = {
      ...params,
      createTime: ctx.helper.moment(),
      userId: user._id
    }
    const res = await ctx.model.Doctor.create(newItem)
    return {
      msg: '医生添加成功',
      data: res,
    }
  }

  async update (params) {
    console.log('params', params)
    const { ctx, app, service } = this
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '医生不存在',
      }
    }
    const findItem = await ctx.model.Doctor.findOne({
      _id: params.id,
    })
    if (!findItem) {
      return {
        msg: '医生不存在',
      }
    }

    //如果传入的参数与数据库中的不同，则更新
    // if (params.name && params.name !== findItem.name) {
    //   updateFields.name = params.name
    // }
    // if (params.password && params.password !== findItem.password) {
    //   updateFields.password = params.password
    // }

    // if (params.userId && params.userId !== findItem.userId) {
    //   updateFields.userId = params.userId
    // }

    //判断诊室是否存在
    if (!app.mongoose.Types.ObjectId.isValid(params.surgeryId)) {
      return {
        msg: '诊室不存在',
      }
    }
    const findSurgery = await ctx.model.Surgery.findOne({
      _id: params.surgeryId,
    })
    if (!findSurgery) {
      return {
        msg: '诊室不存在',
      }
    }
    const updateFields = {
      ...params,
      updateTime: ctx.helper.moment(),
    }

    try {
      await ctx.model.Doctor.updateOne(
        { _id: params.id },
        { $set: updateFields }
      )

      await service.user.update({
        id: params.userId,
        name: params.name,
        password: params.password,
      })
    } catch (err) {

      return {
        msg: '医生修改失败',
      }
    }
    return {
      msg: '医生修改成功',
    }
  }

  async delete (id) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(id)) {
      return {
        msg: '医生不存在',
      }
    }
    const delItem = await ctx.model.Doctor.findOne({
      _id: id,
    })
    if (!delItem) {
      return {
        msg: '医生不存在',
      }
    }
    //删除医生前先要检查该医生是否有未完成的出诊
    const consultList = await ctx.model.Consult.find({
      doctorId: id,
    })
    if (consultList.length > 0) {
      return {
        msg: '该医生有未完成的出诊，无法删除',
      }
    }

    try {
      //删除医生的同时删除用户
      await ctx.model.User.deleteOne({
        _id: delItem.userId,
      })
      await ctx.model.Doctor.deleteOne({
        _id: id,
      })
    } catch (err) {
      return {
        msg: '医生删除失败',
      }
    }
    return {
      msg: '医生删除成功',
    }
  }

}

module.exports = DoctorService
