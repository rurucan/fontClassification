'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // 设置公共秘钥
  config.keys = appInfo.name + '_HciLabForFontStudy20180301';

  // 添加全局中间件
  config.middleware = [];

  // 启动配置项
  config.cluster = {
    listen: {
      hostname: '0.0.0.0',
    },
  };

  // config for mongoose
  config.mongoose = {
    url: 'mongodb://127.0.0.1/fontStudy',
    options: {},
  };

  // 模板引擎配置
  config.view = {
    // root => 使用默认值：app/view
    // cache => 默认开启：true
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
    mapping: {
      '.nj': 'nunjucks',
      '.html': 'nunjucks',
    },
  };

  return config;
};
