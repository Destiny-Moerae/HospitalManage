/* eslint-disable jsdoc/check-tag-names */
'use strict'

const Controller = require('egg').Controller
/**
 * @Controller 医生管理
 */
class DoctorController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.queryRule = {
      page: {
        type: 'string',
        required: false,
        allowEmpty: true,
        default: 1,
      },
      pageSize: {
        type: 'string',
        required: false,
        allowEmpty: true,
        default: 20,
      },
      name: {
        type: 'string',
        required: false,
        allowEmpty: true,
        min: 1,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{1,20}$/,
      },
    }


    this.createRule = {
      name: {
        type: 'string',
        min: 2,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
      },
      surgeryId: {
        type: 'string',
        required: true,
      },


    }

  }

  /**
   * @summary 获取医生列表
   * @description 获取医生列表
   * @router get /api/v1/doctor
   * @request query string page 页码
   * @request query string pageSize 每页数量
   * @request query string name 医生名称
   */
  async index () {
    const { ctx, service } = this
    const data = ctx.query
    ctx.validate(this.queryRule, data)
    const res = await service.doctor.index(data)
    ctx.helper.success({ ctx, res })
  }

  /**
   * @summary 创建医生
   * @description 创建医生
   * @router post /api/v1/doctor
   * @request body createDoctorRequest *body
   */
  async create () {
    const { ctx, service } = this
    const data = ctx.request.body
    ctx.validate(this.createRule, data)
    const res = await service.doctor.create(data)
    ctx.helper.success({ ctx, res })
  }

  /**
   * @summary 更新医生
   * @description 更新医生
   * @router put /api/v1/doctor/{id}
   * @request path string *id
   * @request body updateDoctorRequest *body
   */
  async update () {
    const { ctx, service } = this
    const data = ctx.request.body
    const id = ctx.params.id
    ctx.validate(this.createRule, data)
    const res = await service.doctor.update({
      id,
      name: data.name,
    })
    ctx.helper.success({ ctx, res })
  }

  /**
   * @summary 删除医生
   * @description 删除医生
   * @router delete /api/v1/doctor/{id}
   * @request path string *id
   */
  async destroy () {
    const { ctx, service } = this
    const id = ctx.params.id
    const res = await service.doctor.delete(id)
    ctx.helper.success({ ctx, res })
  }

}

module.exports = DoctorController