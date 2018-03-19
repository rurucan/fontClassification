'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    await this.ctx.render('home', { title: '字体研究' });
  }
}
module.exports = HomeController;
