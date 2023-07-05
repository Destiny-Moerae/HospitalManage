'use strict';

const Service = require('egg').Service;

class SurgeryService extends Service {

  async index(params) {
    const { app, ctx } = this;
    const page = parseInt(params.page, 10) || 1;
    const pageSize = parseInt(params.pageSize, 10) || 20;
    if (params.departmentId && !app.mongoose.Types.ObjectId.isValid(params.departmentId)) {
      return {
        msg: '参数错误',
        code: 1,
      };
    }
    const necessaryCon = {
      ...(params.departmentId && { departmentId: app.mongoose.Types.ObjectId(params.departmentId) }),
    };

    const fuzzyCon = params.name ? { name: new RegExp(params.name, 'i') } : {};

    const query = {
      $and: [
        necessaryCon,
        fuzzyCon,
      ],
    };
    const countPromise = ctx.model.Surgery.countDocuments(query);
    const listPromise = ctx.model.Surgery.aggregate([
      { $match: query },
      { $sort: { createTime: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: 'department',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
        },
      },
      {
        $addFields: {
          departmentName: { $arrayElemAt: [ '$department.name', 0 ] },
        },
      },
      {
        $project: {
          department: 0,
        },
      },
    ]);
    const [ totalCount, list ] = await Promise.all([ countPromise, listPromise ]);
    return {
      data: {
        page,
        pageSize,
        totalCount,
        list,
      },
    };
  }

  async create(params) {
    const { ctx } = this;
    const findItem = await ctx.model.Surgery.findOne({
      name: params.name,
    });
    if (findItem) {
      return {
        msg: '诊室已存在',
        code: 1,
      };
    }
    if (!params.departmentId) {
      return {
        msg: '缺少科室id',
        code: 1,
      };
    }
    const findDepartment = await ctx.model.Department.findOne({
      _id: params.departmentId,
    });
    if (!findDepartment) {
      return {
        msg: '科室不存在',
        code: 1,
      };
    }


    const newItem = {
      ...params,
      createTime: ctx.helper.moment(),
    };

    const res = await ctx.model.Surgery.create(newItem);
    return {
      msg: '诊室添加成功',
      data: res,
    };
  }

  async update(params) {
    const { ctx, app } = this;
    if (!app.mongoose.Types.ObjectId.isValid(params.id)) {
      return {
        msg: '诊室不存在',
        code: 1,
      };
    }
    const findItem = await ctx.model.Surgery.findOne({
      _id: params.id,
    });
    if (!findItem) {
      return {
        msg: '诊室不存在',
        code: 1,
      };
    }

    const duplicateName = await ctx.model.Surgery.findOne({
      _id: { $ne: params.id },
      name: params.name,
    });
    if (duplicateName) {
      return {
        msg: '诊室已存在，请重新修改',
        code: 1,
      };
    }

    const updateFields = {
      ...params,
      updateTime: ctx.helper.moment(),
    };

    try {
      await ctx.model.Surgery.updateOne(
        { _id: params.id },
        { $set: updateFields }
      );
    } catch (err) {
      // console.log(err);
      return {
        msg: '诊室修改失败',
        code: 1,
      };
    }
    return {
      msg: '诊室修改成功',
    };
  }

  async delete(id) {
    const { ctx, app } = this;
    if (!app.mongoose.Types.ObjectId.isValid(id)) {
      return {
        msg: '诊室不存在',
        code: 1,
      };
    }
    const delItem = await ctx.model.Surgery.findOne({
      _id: id,
    });
    if (!delItem) {
      return {
        msg: '诊室不存在',
        code: 1,
      };
    }
    // 在删除前诊室是否有医生
    const doctorList = await ctx.model.Doctor.find({
      surgeryId: id,
    });
    if (doctorList.length > 0) {
      return {
        msg: '该诊室下有医生，不能删除',
        code: 1,
      };
    }
    try {

      await ctx.model.Surgery.deleteOne({
        _id: id,
      });
    } catch (err) {
      return {
        msg: '诊室删除失败',
        code: 1,
      };
    }
    return {
      msg: '诊室删除成功',
    };
  }

}

module.exports = SurgeryService;
