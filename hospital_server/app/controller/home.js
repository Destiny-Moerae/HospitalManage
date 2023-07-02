'use strict'

const { Controller } = require('egg')

class HomeController extends Controller {
  async index () {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }

  async create () {
    const { ctx } = this
    const { name, age } = ctx.request.body
    ctx.body = {
      name,
      age
    }
  }
}

module.exports = HomeController
