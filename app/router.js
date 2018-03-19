'use strict';

module.exports = app => {
  const { RouteManager, router } = app;
  const ctlr = app.controller;
  const needLogin = app.middleware.handleLogin();
  const manager = new RouteManager(router);

  // 为接口测试提供入口
  manager.group('/test', () => {
    manager.get('/', ctlr.test.index);
    manager.get('/user', ctlr.test.user);
  });

  // 为用户建立及登录登出预留接口
  manager.group('/user', () => {
    manager.get('/', ctlr.user.index);
    manager.post('/login', ctlr.user.login);
    manager.get('/logout', ctlr.user.logout).middleware([needLogin]);
    manager.post('/register', ctlr.user.register);
    manager.get('/checkLogin', ctlr.user.checkLogin);
  });

  // 首页渲染
  manager.get('/', ctlr.home.index);

  manager.execute();
};
