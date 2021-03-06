import React from 'react';
import dva from 'dva';
import HomeEntry from './entry/home';
import RouterConfig from './routes/router'

// 第1步：初始化
const app = dva({
  // 可以设置一些配置
  onError(e, dispatch) {
    console.log(e.message);
  },
});

// 第2步：配置插件
// app.use({});

// 第3步：设置model 可以加载多个
app.model();

// 第4步：设置路由or组件
app.router(RouterConfig);

// 第5步：挂载并启动
app.start('#app');
