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
  router.post(baseRouter + '/login', controller.login.index)
  router.resources('department', baseRouter + '/department', controller.department)

}
