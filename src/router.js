const match = require('minimatch');
const columnify = require('columnify');

const Router = function(opts) {
  // Currently no options are used.
  opts = opts || {};

  let _routes = [];
  let _actions = [];

  // Add a route to the routes
  // route: (string) the route to match. Uses minimatch for route matching
  // action: (function) the action (funtion callback) to perform. This function
  //         will be returned on a successful match.
  this.addRoute = (route, action) => {
    if (route && (typeof route) === 'string') {
      if (action && (typeof action) === 'function') {
        let route_len = _routes.push(route);
        let action_len = _actions.push(action);
        if (route_len != action_len) {
          throw `Router Error: Mismatch routes and actions\nroute: ${route}\naction: ${action}`;
        }
      }
      else {
        throw `Router Error: Action must be function for\nroute: ${route}\naction: ${action}`;
      }
    }
    else {
      throw `Router Error: Route must be a string for\nroute: ${route}\naction: ${action}`;
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Adds multiple routes and actions.
  // list: array of arrays. Each array is a pair of [route, action].
  this.addRoutes = (list) => {
    if (list) {
      for (let i = 0; i < list.length; i++) {
        let obj = list[i];
        this.addRoute(obj[0], obj[1]);
      }
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Show the action for the given route
  // Returns the function or -1 if not found
  this.getAction = (route) => {
    let index = _findMatch(route);
    return _actions[index] || -1;
  };

  // Remove a route
  // Returns the action or null if not found
  this.removeRoute = (route) => {
    let action, index = _routes.indexOf(route);
    if (index != -1) {
      _routes.splice(index, 1);
      action = _actions.splice(index, 1);
    }
    return action;
  };

  // Clear all routes
  this.clearAll = () => {
    _routes = [];
    _actions = [];
  }

  // If has route
  this.hasRoute = (route) => {
    var index = _routes.indexOf(route);
    return index != -1 ? true : false;
  }

  // Get a pretty listing of the routes
  this.toString = () => {
    let str = '';
    let data = [];
    for (let i = 0; i < _routes.length; i++) {
      let route = _routes[i];
      let action = _actions[i].name || _actions[i].toString();
      action = action.replace(/\s\s+/g,' ');
      str += `${route}\t\t${action}\n`;
      data.push({route: route, action: action});
    }
    let columns = columnify(data, {
      truncate: true,
      minWidth: 20,
      config: {
        action: {maxWidth: 30},
      },
    });
    return columns;
  }

  // Get all the routes
  this.routes = () => {
    return _routes;
  }

  // Get all the actions
  this.actions = () => {
    return _actions;
  }

  /***
  * Private FUNCTIONS
  ***/

  // Returns the index of a match or null
  let _findMatch = (route) => {
    let index;
    for (let i = 0; i < _routes.length; i++) {
      let possible = _routes[i];
      if (match(route, possible)) {
        index = i;
        break;
      }
    }
    return index;
  }

}

module.exports = Router;
