# Simple Routes

Simple route matcher using minimatch.

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]

## Installation

`npm install simple-routes`

## Usage

Simply import and create router;

```js
let Router = require('simple-routes');

let router = new Router();
```

**Add Routes**

Adding routes is simply a string representing a url to match and an action which is a function.

The url string should follow the [minimatch](https://www.npmjs.com/package/minimatch) documentation for matching.

Routes are added using an array like `['/url/route/**/to/match'], action]`

Action is a function callback. This function will be returned on a successful match

```js
let main_controller = require('./controllers/main');

// route, action
router.addRoute('/index.html', main_controller.index);

// [route,action], [route,action]
router.addRoutes([
  ['/blog/articles/**', main_controller.articles],
  ['**', main_controller.default]
]);

router.hasRoute('/index.html'); // true

let action = router.getAction('/blog/articles/cheese'); // returns main_controller.articles
```

The order in which routes are added is important. In the example above you see the route `**` which would match ANY AND ALL routes. However since it is added last the first two routes will be checked first for a match.

**View Routes**

View a neater layout of the routes.
```js
router.toString();
```


[npm]: https://img.shields.io/npm/v/simple-routes.svg
[npm-url]: https://npmjs.com/package/simple-routes

[node]: https://img.shields.io/node/v/simple-routes.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/cdimoulis/simple-routes.svg
[deps-url]: https://david-dm.org/cdimoulis/simple-routes

[tests]: https://img.shields.io/travis/cdimoulis/simple-routes/master.svg
[tests-url]: https://travis-ci.org/cdimoulis/simple-routes
