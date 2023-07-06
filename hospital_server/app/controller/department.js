/* eslint-disable jsdoc/check-tag-names */
'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller 科室管理
 */
class departmentController extends Controller {
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
      name: {
        type: 'string',
        required: false,
        allowEmpty: true,
        min: 1,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{1,20}$/,
      },
    };


    this.createRule = {
      name: {
        type: 'string',
        min: 2,
        max: 20,
        format: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
      },
      description: {
        type: 'string',
        min: 2,
        max: 200,
      },
    };

  }

  /**
   * @summary 获取科室列表
   * @description 获取科室列表
   * @router get /api/v1/department
   * @request query string page 页码
   * @request query string pageSize 每页数量
   * @request query string name 科室名称
   * @Jwt
   */
  async index() {
    const { ctx, service } = this;
    const data = ctx.query;
    ctx.validate(this.queryRule, data);
    console.log('data', data);
    const res = await service.department.index(data);
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 创建科室
   * @description 创建科室
   * @router post /api/v1/department
   * @request body createDepartmentRequest *body
   * @Jwt
   */
  async create() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    ctx.validate(this.createRule, data);
    const res = await service.department.create(data);
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 更新科室
   * @description 更新科室
   * @router put /api/v1/department/{id}
   * @request path string *id
   * @request body updateDepartmentRequest *body
   * @Jwt
   */
  async update() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const id = ctx.params.id;
    ctx.validate(this.createRule, data);
    const res = await service.department.update({
      id,
      ...data,
    });
    ctx.helper.success({ ctx, res });
  }

  /**
   * @summary 删除科室
   * @description 删除科室
   * @router delete /api/v1/department/{id}
   * @request path string *id
   * @Jwt
   */
  async destroy() {
    const { ctx, service } = this;
    const id = ctx.params.id;
    const res = await service.department.delete(id);
    ctx.helper.success({ ctx, res });
  }

}

module.exports = departmentController;
