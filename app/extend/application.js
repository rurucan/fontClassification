'use strict';

class Route {
  constructor(router) {
    this.router = router;
    this.config = []; // { f: '', n: '', p: '', m: [], c: '' },
  }
  _isStr(str) { return (typeof str) === 'string'; }
  _isFunc(func) { return (typeof func) === 'function'; }
  _isArr(arr) { return Array.isArray(arr); }
  _revisePath(str) {
    let path = str;
    if (!path.startsWith('/')) path = `/${path}`;
    if (path.endsWith('/')) path = path.slice(0, -1);
    return path;
  }

  get(path, controller) {
    if (!this._isStr(path)) {
      console.error('get方法，path只能是路径字符串');
      return;
    }
    const p = this._revisePath(path);
    const f = this.router.get.bind(this.router);
    this.config.push({ f, p, m: [], c: controller });
    return this;
  }
  post(path, controller) {
    if (!this._isStr(path)) {
      console.error('post方法，path只能是路径字符串');
      return;
    }
    const p = this._revisePath(path);
    const f = this.router.post.bind(this.router);
    this.config.push({ f, p, m: [], c: controller });
    return this;
  }
  group(arg1, arg2, arg3) {
    const { _isStr, _isArr, _isFunc } = this;
    let path = '';
    let middleware = [];
    let callback = () => {};

    if (_isFunc(arg3) && _isArr(arg2) && _isStr(arg1)) {
      path = this._revisePath(arg1);
      middleware = arg2;
      callback = arg3;
    } else if (_isFunc(arg2)) {
      if (_isStr(arg1)) path = this._revisePath(arg1);
      else if (_isArr(arg1)) middleware = arg1;
      else {
        console.error('group方法，[前位]参数只能是路径字符串或者中间件数组');
        return;
      }
      callback = arg2;
    } else {
      console.error('group方法，末位参数只能是回调函数,[前位][依次]为路径字符串和中间件数组');
      return;
    }

    const { config } = this;
    const start = config.length;
    callback();
    for (let i = start; i < config.length; i += 1) {
      if (path) config[i].p = `${path}${config[i].p}`;
      this.middleware(middleware, i);
    }
  }

  name(name, i) {
    if (!this._isStr(name)) {
      console.error('name方法，name只能是路由命名字符串');
      return;
    }
    const { config } = this;
    const index = i || config.length - 1;
    config[index].n = name;
    return this;
  }
  middleware(arrs, i) {
    if (!this._isArr(arrs)) {
      console.error('middleware方法，参数只能是中间件数组');
      return;
    }
    const { config } = this;
    const index = i || config.length - 1;
    const target = config[index];
    target.m = [...arrs, ...target.m];
    return this;
  }

  execute() {
    const { config } = this;
    config.forEach(item => {
      const { f, n, p, m = [], c } = item;
      const args = [p, ...m, c];
      if (n) f(n, ...args);
      else f(...args);
    });
  }

  show() {
    this.config.forEach(item => {
      const { f, n, p, m = [], c } = item;
      const args = [p, ...m, c];
      if (n) console.log(f, n, ...args);
      else console.log(f, ...args);
    });
  }
}

// #region  demo-测试简单用例
/*----------------------------------------------------------------------
show() {
  this.config.forEach((item, index) => {
    console.log(index + '------------------------------------------');
    console.log(item.f, item.n || 'unamed');
    console.log(item.p, ...item.m, item.c, '\n');
  });
}

const router = {
  get(...args) { console.log('get', args); },
  post(...args) { console.log('post', args); },
};
const route = new Route(router);

route.get('/p1', 'c1').name('n1');
route.post('/p2', 'c2').middleware(['m1']);

route.group('/p3', ['m8'], () => {
  route.get('/p4', 'c4');
  route.post('/p5', 'c5').name('n2').middleware(['m2', 'm3']);

  route.group('/p6', () => {
    route.get('/p7', 'c6');
    route.post('/p8', 'c7').middleware(['m4', 'm5']).name('n3');
  });

  route.group(['m9', 'm10'], () => {
    route.get('/p10', 'c8');
    route.post('/p11', 'c9').middleware(['m6', 'm7']).name('n4');
  });
});

route.show();
route.execute();
----------------------------------------------------------------------*/
// #endregion

module.exports = {
  RouteManager: Route,
};
