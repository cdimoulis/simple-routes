const Routes = require('../src/routes');

let routes = new Routes();
let action1 = () => {return 1;};
let action2 = () => {return 2;};

test('Add route', () => {
  routes.addRoute('/test', action1);
  let _routes = routes.routes();
  let _actions = routes.actions();
  expect(_routes.length).toBe(1);
  expect(_actions.length).toBe(1);
  expect(_routes).toContain('/test');
  expect(_actions).toContain(action1);
});

test('Add duplicate route', () => {
  routes.addRoute('/test', action2);
  expect(routes.routes().length).toBe(1);
  expect(routes.actions().length).toBe(1);
  expect(routes.actions()[0]).toBe(action1);
});

test('Clear all', () => {
  routes.clearAll();
  let _routes = routes.routes();
  let _actions = routes.actions();
  expect(_routes.length).toBe(0);
  expect(_actions.length).toBe(0);
});

test('Add routes', () => {
  routes.clearAll();
  // Create a function without name
  let f = {};
  f.x = () => {return 3;};
  routes.addRoutes([
    ['/test', action1],
    ['/love/*', action2],
    ['/temp', f.x],
  ]);
  let _routes = routes.routes();
  let _actions = routes.actions();
  expect(_routes.length).toBe(3);
  expect(_actions.length).toBe(3);
  expect(_routes[1]).toBe('/love/*');
  expect(_actions[1]).toBe(action2);
});

test('Get Action', () => {
  expect(routes.getAction('/test')).toBe(action1);
  expect(routes.getAction('/love/food')).toBe(action2);
  expect(routes.getAction('/not_found')).toBeUndefined();
});

test('Get Route Match', () => {
  routes.addRoutes([
    ['/a/b/*/c', action1],
    ['/*/b/*/c', action1]
  ]);
  expect(routes.getRouteMatch('/a/b/z/c')).toBe('/a/b/*/c');
  expect(routes.getRouteMatch('/x/b/z/c')).toBe('/*/b/*/c');
  expect(routes.getRouteMatch('/love/q')).toBe('/love/*');
  expect(routes.getRouteMatch('/a/b/z/c/d')).toBeUndefined();
  routes.removeRoute('/a/b/*/c');
  routes.removeRoute('/*/b/*/c');
});

test('Remove route', () => {
  routes.removeRoute('test');
  let _routes = routes.routes();
  expect(_routes.length).toBe(3);
  routes.removeRoute('/test');
  _routes = routes.routes();
  let _actions = routes.actions();
  expect(_routes.length).toBe(2);
  expect(_actions.length).toBe(2);
  expect(_routes).not.toContain('/test');
  expect(_actions).not.toContain(action1);
});

test('Add route with query', () => {
  routes.addRoute('/query?a=1&b=2', action1);
  // With no query
  expect(routes.hasRoute('/query')).toBeTruthy();
  // With query
  expect(routes.hasRoute('/query?peace=love')).toBeTruthy();
  expect(routes.getAction('/query?children=3&parents=2')).toBe(action1);
});

test('Remove route with query', () => {
  routes.removeRoute('/query');
  expect(routes.hasRoute('/query')).toBeFalsy();
});

test('Has Route', () => {
  expect(routes.hasRoute('/love/*')).toBeTruthy();
  expect(routes.hasRoute('/not_found')).toBeFalsy();
});

test('Get Route Match', () => {
  expect(routes.getRouteMatch('/love/family')).toBe('/love/*')
});

test('To String', () => {
  expect(typeof routes.toString()).toBe('string');
});


// EXCEPTIONS
test('Bad Route', () => {
  let f = () => {routes.addRoute(3, action1)};
  expect(f).toThrow(/Routes Error: Route must be a string/);
});

test('Bad Action', () => {
  let f = () => {routes.addRoute('/edit',3)};
  expect(f).toThrow(/Routes Error: Action must be a function/);
});

test('Missmatch routes-actions', () => {
  let f = () => {
    routes.addRoutes([
      ['/test',action1],
      ['/peace']
    ]);
  };
  expect(f).toThrow();
});

test('Invalid list', () => {
  let f = () => {routes.addRoutes('/edit',action1)};
  expect(f).toThrow(/Routes Error: List must be an array/);
})
