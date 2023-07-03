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

    const query = {
      $and: [
        necessaryCon,
        fuzzyCon,
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
        $project: {
          surgery: 0,
          surgeryId: 0,
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
    const findItem = await ctx.model.Doctor.findOne({
      _id: params.id,
    })
    if (findItem) {
      return {
        msg: '医生已存在',
      }
    }
    if (!params.surgeryId) {
      return {
        msg: '缺少诊室id',
      }
    }
    const newItem = {
      ...params,
      createTime: ctx.helper.moment(),
    }

    const res = await ctx.model.Doctor.create(newItem)
    return {
      msg: '医生添加成功',
      data: res,
    }
  }

  async update (params) {
    const { ctx, app } = this
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

    const updateFields = {}
    if (params.name !== findItem.name) {
      updateFields.name = params.name
    }
    if (params.description !== findItem.description) {
      updateFields.description = params.description
    }
    if (params.sex !== findItem.sex) {
      updateFields.sex = params.sex
    }
    if (params.birth !== findItem.birth) {
      updateFields.birth = params.birth
    }
    if (params.idNumber !== findItem.idNumber) {
      updateFields.idNumber = params.idNumber
    }
    if (params.phone !== findItem.phone) {
      updateFields.phone = params.phone
    }
    if (params.fee !== findItem.fee) {
      updateFields.fee = params.fee
    }
    if (params.phone !== findItem.phone) {
      updateFields.phone = params.phone
    }
    updateFields.updateTime = ctx.helper.moment()

    try {
      await ctx.model.Doctor.updateOne(
        { _id: params.id },
        { $set: updateFields }
      )
    } catch (err) {
      // console.log(err);
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

    try {

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
