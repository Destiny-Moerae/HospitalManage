'use strict'

const Service = require('egg').Service

class DoctorService extends Service {

  async index (params) {
    const { ctx } = this

    const page = parseInt(params.page, 10) || 1
    const pageSize = parseInt(params.pageSize, 10) || 20
    const query = {}
    if (params.name) {
      query.name = new RegExp(params.name, 'i')
    }

    const countPromise = ctx.model.Doctor.countDocuments(query)
    const listPromise = ctx.model.Doctor
      .find(query)
      .sort({ createTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('surgeryId')
      .lean()
      .exec()
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

    const duplicateName = await ctx.model.Doctor.findOne({
      _id: { $ne: params.id },
      name: params.name,
      description: params.description,
      sex: params.sex,
      birth: params.birth,
      idNumber: params.idNumber,
      phone: params.phone,
      fee: params.fee,
    })
    if (duplicateName) {
      return {
        msg: '医生已存在，请重新修改',
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
      upadateField.sex = params.sex
    }
    if (params.birth !== findItem.birth) {
      upadateField.birth = params.birth
    }
    if (params.idNumber !== findItem.idNumber) {
      upadateField.idNumber = params.idNumber
    }
    if (params.phone !== findItem.phone) {
      upadateField.phone = params.phone
    }
    if (params.fee !== findItem.fee) {
      upadateField.fee = params.fee
    }
    if (params.phone !== findItem.phone) {
      upadateField.phone = params.phone
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
