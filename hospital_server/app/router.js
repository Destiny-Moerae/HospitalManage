'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app
  const baseRouter = app.config.baseRouter

  // 重定向到swagger
  router.redirect('/', '/swagger-ui.html', 302)

  router.get('/home', controller.home.index)

  // 登录/退出
  router.post(baseRouter + '/user/login', controller.user.login)
  router.post(baseRouter + '/user/logout', controller.user.logout)

  // 科室管理
  router.resources('department', baseRouter + '/department', controller.department)

  // 诊室管理
  router.resources('surgery', baseRouter + '/surgery', controller.surgery)

  // 医生管理
  router.resources('doctor', baseRouter + '/doctor', controller.doctor)

  // 出诊管理
  router.resources('consult', baseRouter + '/consult', controller.consult)
}
