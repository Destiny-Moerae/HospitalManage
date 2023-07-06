'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  const checkAdmin = app.middleware.checkAdmin();
  const baseRouter = app.config.baseRouter;

  // 重定向到swagger
  router.redirect('/', '/swagger-ui.html', 302);

  router.get('/home', controller.home.index);

  // 登录/退出
  router.post(baseRouter + '/user/login', controller.user.login);
  router.post(baseRouter + '/user/logout', controller.user.logout);

  // 科室管理
  // router.resources('department', baseRouter + '/department', controller.department);
  // 改为精细化路由
  router.get(baseRouter + '/department', jwt, controller.department.index);
  // router.get(baseRouter + '/department/:id', controller.department.show);
  router.post(baseRouter + '/department', jwt, checkAdmin, controller.department.create);
  router.put(baseRouter + '/department/:id', jwt, checkAdmin, controller.department.update);
  router.delete(baseRouter + '/department/:id', jwt, checkAdmin, controller.department.destroy);


  // 诊室管理
  // router.resources('surgery', baseRouter + '/surgery', controller.surgery);
  // 改为精细化路由
  router.get(baseRouter + '/surgery', jwt, controller.surgery.index);
  // router.get(baseRouter + '/surgery/:id', controller.surgery.show);
  router.post(baseRouter + '/surgery', jwt, checkAdmin, controller.surgery.create);
  router.put(baseRouter + '/surgery/:id', jwt, checkAdmin, controller.surgery.update);
  router.delete(baseRouter + '/surgery/:id', jwt, checkAdmin, controller.surgery.destroy);

  // 医生管理
  router.resources('doctor', baseRouter + '/doctor', jwt, controller.doctor);

  // 出诊管理
  // router.resources('consult', baseRouter + '/consult', controller.consult);
  // 改为精细化路由
  router.get(baseRouter + '/consult', jwt, controller.consult.index);
  // router.get(baseRouter + '/consult/:id', controller.consult.show);
  router.post(baseRouter + '/consult', jwt, checkAdmin, controller.consult.create);
  router.put(baseRouter + '/consult/:id', jwt, checkAdmin, controller.consult.update);
  router.delete(baseRouter + '/consult/:id', jwt, checkAdmin, controller.consult.destroy);
};
