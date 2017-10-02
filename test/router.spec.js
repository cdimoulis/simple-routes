const Routes = require('../src/routes');

let router = new Routes();
let action1 = () => {return 1;};
let action2 = () => {return 2;};

test('Add route', () => {
  router.addRoute('/test', action1);
  let _routes = router.routes();
  let _actions = router.actions();
  expect(_routes.length).toBe(1);
  expect(_actions.length).toBe(1);
  expect(_routes).toContain('/test');
  expect(_actions).toContain(action1);
});

test('Clear all', () => {
  router.clearAll();
  let _routes = router.routes();
  let _actions = router.actions();
  expect(_routes.length).toBe(0);
  expect(_actions.length).toBe(0);
});

test('Add routes', () => {
  router.clearAll();
  // Create a function without name
  let f = {};
  f.x = () => {return 3;};
  router.addRoutes([
    ['/test', action1],
    ['/love/*', action2],
    ['/temp', f.x],
  ]);
  let _routes = router.routes();
  let _actions = router.actions();
  expect(_routes.length).toBe(3);
  expect(_actions.length).toBe(3);
  expect(_routes[1]).toBe('/love/*');
  expect(_actions[1]).toBe(action2);
});

test('Get Action', () => {
  expect(router.getAction('/test')).toBe(action1);
  expect(router.getAction('/love/food')).toBe(action2);
  expect(router.getAction('/not_found')).toBeUndefined();
});

test('Get Route Match', () => {
  router.addRoutes([
    ['/a/b/*/c', action1],
    ['/*/b/*/c', action1]
  ]);
  expect(router.getRouteMatch('/a/b/z/c')).toBe('/a/b/*/c');
  expect(router.getRouteMatch('/x/b/z/c')).toBe('/*/b/*/c');
  expect(router.getRouteMatch('/love/q')).toBe('/love/*');
  expect(router.getRouteMatch('/a/b/z/c/d')).toBeUndefined();
  router.removeRoute('/a/b/*/c');
  router.removeRoute('/*/b/*/c');
});

test('Remove route', () => {
  router.removeRoute('test');
  let _routes = router.routes();
  expect(_routes.length).toBe(3);
  router.removeRoute('/test');
  _routes = router.routes();
  let _actions = router.actions();
  expect(_routes.length).toBe(2);
  expect(_actions.length).toBe(2);
  expect(_routes).not.toContain('/test');
  expect(_actions).not.toContain(action1);
});

test('Add route with query', () => {
  router.addRoute('/query?a=1&b=2', action1);
  // With no query
  expect(router.hasRoute('/query')).toBeTruthy();
  // With query
  expect(router.hasRoute('/query?peace=love')).toBeTruthy();
  expect(router.getAction('/query?children=3&parents=2')).toBe(action1);
});

test('Remove route with query', () => {
  router.removeRoute('/query');
  expect(router.hasRoute('/query')).toBeFalsy();
});

test('Has Route', () => {
  expect(router.hasRoute('/love/*')).toBeTruthy();
  expect(router.hasRoute('/not_found')).toBeFalsy();
});

test('Get Route Match', () => {
  expect(router.getRouteMatch('/love/family')).toBe('/love/*')
});

test('To String', () => {
  expect(typeof router.toString()).toBe('string');
});


// EXCEPTIONS
test('Bad Route', () => {
  let f = () => {router.addRoute(3, action1)};
  expect(f).toThrow(/Routes Error: Route must be a string/);
});

test('Bad Action', () => {
  let f = () => {router.addRoute('/edit',3)};
  expect(f).toThrow(/Routes Error: Action must be a function/);
});

test('Missmatch routes-actions', () => {
  let f = () => {
    router.addRoutes([
      ['/test',action1],
      ['/peace']
    ]);
  };
  expect(f).toThrow();
});

test('Invalid list', () => {
  let f = () => {router.addRoutes('/edit',action1)};
  expect(f).toThrow(/Routes Error: List must be an array/);
})
