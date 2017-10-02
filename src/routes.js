const match = require('minimatch');
const columnify = require('columnify');

let options;

let _routes = [];
let _actions = [];

class Routes {

  constructor(opts) {
    // Currently no options are used.
    this.options = opts || {};
  }

  // Add a route to the routes
  // route: (string) the route to match. Uses minimatch for route matching
  // action: (function) the action (funtion callback) to perform. This function
  //         will be returned on a successful match.
  addRoute(route, action) {
    if (route && (typeof route) === 'string') {
      if (action && (typeof action) === 'function') {
        // Detect any query strings and warn that they are ignored
        let rq = route.split('?');
        if (rq.length > 1)
          console.warn('Query strings are ignored in route matching');
        _routes.push(rq[0]);
        _actions.push(action);
      }
      else {
        throw new Error(`Routes Error: Action must be a function for\nroute: ${route}\naction: ${action}`);
      }
    }
    else {
      throw new Error(`Routes Error: Route must be a string for\nroute: ${route}\naction: ${action}`);
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Adds multiple routes and actions.
  // list: array of arrays. Each array is a pair of [route, action].
  addRoutes(list) {
    if (list && Array.isArray(list)) {
      list.forEach((obj) => {
        this.addRoute(obj[0], obj[1]);
      });
    }
    else {
      throw new Error(`Routes Error: List must be an array\nList: ${list}`)
    }
    // Allow chaining of addRoutes
    return this;
  };

  // Show the action for the given route
  // Returns the function or -1 if not found
  getAction(route) {
    // Separate potential query string
    let rq = route.split('?');
    // Index of path only
    let index = _findMatch(rq[0]);
    return _actions[index];
  };

  // Get the route patter that is matched

  // Returns null if not found
  getRouteMatch(route) {
    // Separate potential query string
    let rq = route.split('?');
    // Index of path only
    let index = _findMatch(rq[0]);
    return _routes[index];
  };

  // Remove a route
  // Returns the action or null if not found
  removeRoute(route) {
    // Separate potential query string
    let rq = route.split('?');
    // Index of path only
    let action, index = _routes.indexOf(rq[0]);
    if (index != -1) {
      _routes.splice(index, 1);
      action = _actions.splice(index, 1);
    }
    return action;
  };

  // Clear all routes
  clearAll() {
    _routes = [];
    _actions = [];
  }

  // If has route
  hasRoute(route) {
    // Separate potential query string
    let rq = route.split('?');
    // Index of path only
    var index = _routes.indexOf(rq[0]);
    return index != -1 ? true : false;
  }

  // Get a pretty listing of the routes
  toString() {
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
  routes() {
    return _routes;
  }

  // Get all the actions
  actions() {
    return _actions;
  }
};


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
};

module.exports = Routes;
