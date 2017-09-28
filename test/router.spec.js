const Router = require('../src/router');

let router = new Router();
let action1 = () => {return 1;};
let action2 = () => {return 2;};

test('Add route', () => {
  router.addRoute('/test', action1);
  let routes = router.routes();
  let actions = router.actions();
  expect(routes.length).toBe(1);
  expect(actions.length).toBe(1);
  expect(routes).toContain('/test');
  expect(actions).toContain(action1);
});

test('Clear all', () => {
  router.clearAll();
  let routes = router.routes();
  let actions = router.actions();
  expect(routes.length).toBe(0);
  expect(actions.length).toBe(0);
});

test('Add routes', () => {
  router.clearAll();
  router.addRoutes([
    ['/test', action1],
    ['/love', action2],
  ]);
  let routes = router.routes();
  let actions = router.actions();
  expect(routes.length).toBe(2);
  expect(actions.length).toBe(2);
  expect(routes[1]).toBe('/love');
  expect(actions[1]).toBe(action2);
});

test('Get Action', () => {
  expect(router.getAction('/test')).toBe(action1);
  expect(router.getAction('/love')).toBe(action2);
});

test('Remove route', () => {
  router.removeRoute('test');
  let routes = router.routes();
  expect(routes.length).toBe(2);
  router.removeRoute('/test');
  routes = router.routes();
  let actions = router.actions();
  expect(routes.length).toBe(1);
  expect(actions.length).toBe(1);
  expect(routes).not.toContain('/test');
  expect(actions).not.toContain(action1);
});

test('Has Route', () => {
  expect(router.hasRoute('/love')).toBeTruthy();
});

test('To String', () => {
  expect(typeof router.toString()).toBe('string');
});

// EXCEPTIONS
test('Bad Route', () => {
  let f = () => {router.addRoute(3, action1)};
  expect(f).toThrow(/Router Error: Route must be a string/);
});

test('Bad Action', () => {
  let f = () => {router.addRoute('/edit',3)};
  expect(f).toThrow(/Router Error: Action must be a function/);
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
