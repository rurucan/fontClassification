import React from 'react';
import { Router, Route, Switch, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
// import HomePage from '../entry/home';


// function RouterConfig({ history }) {
//   return (
//     <Router history={history}>
//       <Switch>
//         <Route path="/" exact component={HomePage} />
//       </Switch>
//     </Router>
//   );
// }

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history, app }) {
  const routes = [
    {
      path: '/',
      name: 'HomePage',
      models: () => [import('../model/main')],
      component: () => import('../entry/home'),
    }
  ];

  return (
    <ConnectedRouter history={history}>
      <Switch>
        {
          routes.map(({ path, name, ...dynamics }) => (
            <Route 
              key={name}
              exact
              path={path}
              component={dynamic({
                app,
                ...dynamics,
              })}
            />
          ))
        }
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;