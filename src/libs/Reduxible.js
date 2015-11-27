import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReduxibleRouter from './ReduxibleRouter';
import StoreFactory from './StoreFactory';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';

export default class Reduxible {
  constructor(options = {}) {
    this.config = options.config;
    this.container = options.container;
    this.errorContainer = options.errorContainer;
    this.routes = options.routes;
    this.storeFactory = new StoreFactory({...options});
  }

  server() {
    const store = this.storeFactory.createStore();
    const history = createMemoryHistory();
    const router = new ReduxibleRouter(this.routes, store, history);
    return (req, res) => {
      router.route(req.originalUrl, (error, redirectLocation, component)=> {
        if (error) {
          if (this.errorContainer) {
            return res.status(500).end(this.render(this.errorContainer, store));
          }
          return res.status(500).end(error);
        } else if (redirectLocation) {
          return res.redirect(redirectLocation.pathname);
        } else {
          return res.send(this.render(component, store));
        }
      });
    };
  }

  render(component, store) {
    const Html = this.container;
    return '<!doctype html>\n' + ReactDOMServer.renderToString(<Html component={component} store={store}/>);
  }

  client(initialState, dest) {
    const store = this.storeFactory.createStore(initialState);
    const history = createBrowserHistory();
    const router = new ReduxibleRouter(this.routes, store, history);
    ReactDOM.render(router.render(), dest);
    if (this.config.useDevTools()) {
      window.React = React;
      ReactDOM.render(router.renderDevTools(), dest);
    }
  }

  replaceReducer
}
