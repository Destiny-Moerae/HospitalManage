'use strict'

const Service = require('egg').Service

class SurgeryService extends Service {

  async index (params) {
    const { ctx } = this

    const page = parseInt(params.page, 10) || 1
    const pageSize = parseInt(params.pageSize, 10) || 20
    const query = {}
    if (params.name) {
      query.name = new RegExp(params.name, 'i')
    }

    const countPromise = ctx.model.Surgery.countDocuments(query)
    const listPromise = ctx.model.Surgery
      .find(query)
      .sort({ createTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('departmentId')
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
    const findItem = await ctx.model.Surgery.findOne({
      name: params.name,
    })
    if (findItem) {
      return {
        msg: '诊室已存在',
      }
    }
    if (!params.departmentId) {
      return {
        msg: '缺少科室id',
      }
    }
    const newItem = {
      ...params,
      createTime: ctx.helper.moment(),
    }

    const res = await ctx.model.Surgery.create(newItem)
    return {
      msg: '诊室添加成功',
      data: res,
    }
  }

  async update (params) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '诊室不存在',
      }
    }
    const findItem = await ctx.model.Surgery.findOne({
      _id: params.id,
    })
    if (!findItem) {
      return {
        msg: '诊室不存在',
      }
    }

    const duplicateName = await ctx.model.Surgery.findOne({
      _id: { $ne: params.id },
      name: params.name,
      description: params.description,
    })
    if (duplicateName) {
      return {
        msg: '诊室已存在，请重新修改',
      }
    }

    const updateFields = {}
    if (params.name !== findItem.name) {
      updateFields.name = params.name
    }
    if (params.description !== findItem.description) {
      updateFields.description = params.description
    }
    updateFields.updateTime = ctx.helper.moment()

    try {
      await ctx.model.Surgery.updateOne(
        { _id: params.id },
        { $set: updateFields }
      )
    } catch (err) {
      // console.log(err);
      return {
        msg: '诊室修改失败',
      }
    }
    return {
      msg: '诊室修改成功',
    }
  }

  async delete (id) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(id)) {
      return {
        msg: '诊室不存在',
      }
    }
    const delItem = await ctx.model.Surgery.findOne({
      _id: id,
    })
    if (!delItem) {
      return {
        msg: '诊室不存在',
      }
    }

    try {

      await ctx.model.Surgery.deleteOne({
        _id: id,
      })
    } catch (err) {
      return {
        msg: '诊室删除失败',
      }
    }
    return {
      msg: '诊室删除成功',
    }
  }

}

module.exports = SurgeryService
