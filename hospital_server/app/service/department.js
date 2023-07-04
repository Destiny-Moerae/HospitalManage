'use strict'

const Service = require('egg').Service

class DepartmentService extends Service {

  async index (params) {
    const { ctx } = this

    const page = parseInt(params.page, 10) || 1
    const pageSize = parseInt(params.pageSize, 10) || 20
    const query = {}
    if (params.name) {
      query.name = new RegExp(params.name, 'i')
    }

    const countPromise = ctx.model.Department.countDocuments(query)
    const listPromise = ctx.model.Department
      .find(query)
      .sort({ createTime: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
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
    const findItem = await ctx.model.Department.findOne({
      name: params.name,
    })
    if (findItem) {
      return {
        msg: '科室已存在',
      }
    }
    const newItem = {
      ...params,
      createTime: ctx.helper.moment(),
    }

    const res = await ctx.model.Department.create(newItem)
    return {
      msg: '科室添加成功',
      data: res,
    }
  }

  async update (params) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '科室不存在',
      }
    }
    const findItem = await ctx.model.Department.findOne({
      _id: params.id,
    })
    if (!findItem) {
      return {
        msg: '科室不存在',
      }
    }

    const duplicateName = await ctx.model.Department.findOne({
      _id: { $ne: params.id },
      name: params.name,
    })
    if (duplicateName) {
      return {
        msg: '科室已存在，请重新修改',
      }
    }

    const updateFields = {
      ...params,
      updateTime: ctx.helper.moment(),
    }

    try {
      await ctx.model.Department.updateOne(
        { _id: params.id },
        { $set: updateFields }
      )
    } catch (err) {
      // console.log(err);
      return {
        msg: '科室修改失败',
      }
    }
    return {
      msg: '科室修改成功',
    }
  }

  async delete (id) {
    const { ctx, app } = this
    if (!app.mongoose.Types.ObjectId.isValid(id)) {
      return {
        msg: '科室不存在',
      }
    }
    const delItem = await ctx.model.Department.findOne({
      _id: id,
    })
    if (!delItem) {
      return {
        msg: '科室不存在',
      }
    }
    //在删除科室之前，先检查该科室下是否有诊室
    const surgeryList = await ctx.model.Surgery.find({
      departmentId: id,
    })
    if (surgeryList.length > 0) {
      return {
        msg: '该科室下存在诊室，无法删除',
      }
    }
    try {
      await ctx.model.Department.deleteOne({
        _id: id,
      })
    } catch (err) {
      return {
        msg: '科室删除失败',
      }
    }
    return {
      msg: '科室删除成功',
    }
  }

}

module.exports = DepartmentService
