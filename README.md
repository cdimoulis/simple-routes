# Simple Routes

A simple route pattern matcher and action associator.

[Changelog](https://github.com/cdimoulis/simple-routes/blob/master/changelog.md)

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

## Installation

`npm install simple-routes`

## Usage

Simply import and create routes;

```js
let Routes = require('simple-routes');

let routes = new Routes();
```

#### Add Routes

Add route patterns by using a string representing a url to match and an action that should match that pattern.

The url string (route pattern) should follow the [minimatch](https://www.npmjs.com/package/minimatch) documentation for matching.

Route patternss are added using an array like `['/url/route/*/to/match', action]`

Action is a function callback. This function will be returned on a successful match.

```js
let main_controller = require('./controllers/main');

// route, action
routes.addRoute('/index.html', main_controller.index);

// [route,action], [route,action]
routes.addRoutes([
  ['/blog/articles/*', main_controller.articles],
  ['**', main_controller.default]
]);

routes.hasRoute('/index.html'); // true

let action = routes.getAction('/blog/articles/cheese'); // returns main_controller.articles, undefined if not found
```

**Errors**



**NOTE:**

The order in which route patterns are added is important. In the example above you see the route `**` which would match ANY AND ALL routes. However since it is added last the first two routes will be checked first for a match.

**Duplicate** route patterns will log a warning and be ignored (since they would never be reached anyway)

**QUERY STRINGS:**

Query strings are ignored when adding a route (`addRoute(...)`) and calling `hasRoute(...)`, `getAction(...)`, and `removeRoute(...)`. Only the path will be considered in the match.

#### View Routes

You can get an array of all the route patterns currently in the routes:
```js
routes.routes();
```

You can get an array of all the actions currently in the routes:
```js
routes.actions();
```

Get the action if the passed route string matches a route pattern. Undefined if not found:
```js
routes.getAction('/...');
```

Get the route pattern that the passed route string matches. Undefined if not found:
```js
routes.getRouteMatch('/...');
```

View a neater layout of the current route patterns in the router. If the function passed is a named function statement the function name will show. Otherwise the function will print.

```js
routes.toString();

// ROUTE                ACTION              
// /index.html          index                   
// /blog/article/*      articles                   
// **                   default      
```

Named function statements (as opposed to a function literal) will help with this table. If using a function constructor then using a named function will be helpful:
```js
Controller = new function() {

  this.index = function index() {
    ...
  };

  this.create = function() {

  };
};

let main_controller = new Controller();
main_controller.index.name; // index
main_controller.create.name; // ''
```

#### Remove Routes

You can remove an individual route pattern:
```js
routes.removeRoute('/blog/articles/**');
```

You can remove all routes:
```js
routes.clearAll();
```

## Extending Routes

You can extend the routes using the class extend syntax available in node >6.11

```js
const SimpleRoutes = require('simple-routes');

class MyRoutes extends SimpleRoutes {
  // override functions as you wish
  ...
};
```


[npm]: https://img.shields.io/npm/v/simple-routes.svg
[npm-url]: https://npmjs.com/package/simple-routes

[node]: https://img.shields.io/node/v/simple-routes.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/cdimoulis/simple-routes.svg
[deps-url]: https://david-dm.org/cdimoulis/simple-routes

[tests]: https://img.shields.io/travis/cdimoulis/simple-routes/master.svg
[tests-url]: https://travis-ci.org/cdimoulis/simple-routes

[cover]: https://coveralls.io/repos/github/cdimoulis/simple-routes/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/cdimoulis/simple-routes?branch=master
