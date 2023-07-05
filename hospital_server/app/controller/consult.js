/* eslint-disable jsdoc/check-tag-names */
'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller 出诊管理
 */
class ConsultController extends Controller {
  constructor(ctx) {
    super(ctx);

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
      doctorId: {
        type: 'string',
        required: false,
        allowEmpty: true,
      },
      surgeryId: {
        type: 'string',
        required: false,
        allowEmpty: true,
      },
      departmentId: {
        type: 'string',
        required: false,
        allowEmpty: true,
      },
      startDate: {
        type: 'string',
        required: false,
        allowEmpty: true,
      },
      endDate: {
        type: 'string',
        required: false,
        allowEmpty: true,
      },
    };


    this.createRule = {
      doctorId: {
        type: 'string',
        required: true,
      },
      date: {
        type: 'number',
        required: true,
      },
      startTime: {
        type: 'string',
        required: true,
      },
      endTime: {
        type: 'string',
        required: true,
      },
    };

  }

  /**
   * @summary 获取出诊列表
   * @description 获取出诊列表
   * @router get /api/v1/consult
   * @request query string page 页码
   * @request query string pageSize 每页数量
   * @request query string surgeryId 诊室id
   * @request query string doctorId 医生id
   * @request query string departmentId 科室id
   * @request query string startDate 开始日期
   * @request query string endDate 结束日期
   */
  async index() {
    const { ctx, service } = this;
    const data = ctx.query;
    ctx.validate(this.queryRule, data);
    const res = await service.consult.index(data);
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 创建出诊
   * @description 创建出诊
   * @router post /api/v1/consult
   * @request body createConsultRequest *body
   */
  async create() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    console.log('controller-data', data);
    ctx.validate(this.createRule, data);
    const res = await service.consult.create(data);
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 更新出诊
   * @description 更新出诊
   * @router put /api/v1/consult/{id}
   * @request path string *id
   * @request body updateConsultRequest *body
   */
  async update() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const id = ctx.params.id;

    ctx.validate(this.createRule, data);
    const res = await service.consult.update({
      id,
      ...data,
    });
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 删除出诊
   * @description 删除出诊
   * @router delete /api/v1/consult/{id}
   * @request path string *id
   */
  async destroy() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    const res = await service.consult.delete(id);
    ctx.helper.success({ ctx, res });
  }

}

module.exports = ConsultController;
