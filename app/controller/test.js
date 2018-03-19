'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async index() {
    this.ctx.body = { success: true, data: 'haha' };
  }
  async user() {
    this.ctx.body = { success: true, data: 'haha' };
  }
}
module.exports = TestController;
