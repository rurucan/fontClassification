'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    this.ctx.body = { success: true, data: 'haha' };
  }
  async login() {
    this.ctx.body = { success: true, data: 'haha' };
  }
  async logout() {
    this.ctx.session.user = null;
    this.ctx.body = { success: true, message: '成功退出登录' };
  }
  async checkLogin() {
    this.ctx.body = { success: true, data: 'haha' };
  }
  async register() {
    this.ctx.body = { success: true, data: 'haha' };
  }
}
module.exports = UserController;
