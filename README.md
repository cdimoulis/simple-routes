## Simple Routes: A simple route matcher

Simple route matcher using minimatch.

### Installation

`npm install simple-routes`

### Usage

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

router.addRoute(['/index.html', main_controller.index]);

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
