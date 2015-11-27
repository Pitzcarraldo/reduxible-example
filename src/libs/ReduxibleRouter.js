import React from 'react';
import { Router, RoutingContext, match } from 'react-router'
import { Provider } from 'react-redux';
import { syncReduxAndRouter } from 'redux-simple-router';
import DevTools from './DevTools';

export default class ReduxibleRouter {
  constructor(routes, store, history) {
    this.routes = routes;
    this.store = store;
    this.history = history;
    syncReduxAndRouter(this.history, this.store);
  }

  route(location, callback) {
    match({routes: this.routes, location}, (error, redirectLocation, renderProps) => {
      if (error) {
        return callback(error);
      } else if (redirectLocation) {
        return callback(null, redirectLocation);
      } else if (renderProps) {
        return callback(null, null, this._provide(<RoutingContext {...renderProps} />));
      } else {
        return callback();
      }
    });
  }

  render() {
    return this._provide(this._getRouter());
  }

  renderDevTools() {
    return this._provide(this._getDevToolsRouter());
  }

  _provide(children) {
    return (
      <Provider store={this.store} key="provider">
        {children}
      </Provider>
    )
  }

  _getRouter() {
    return <Router history={this.history} routes={this.routes}/>;
  }

  _getDevToolsRouter() {
    return (
      <div>
        {this._getRouter()}
        <DevTools/>
      </div>
    );
  }
}
