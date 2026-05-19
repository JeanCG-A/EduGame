const path = require('path');
require('dotenv').config({ path: path.resolve('.env') });
const app = require('./src/app');
const printRoutes = (stack, prefix = '') => {
  stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      console.log(prefix + layer.route.path + ' [' + methods + ']');
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      const regex = layer.regexp && layer.regexp.source !== '^\\/?$' ? layer.regexp.source.replace('^\\/?','').replace('\\/?$','') : '';
      printRoutes(layer.handle.stack, prefix + (regex ? regex : ''));
    }
  });
};
if (!app._router) {
  console.error('No router found on app');
  process.exit(1);
}
printRoutes(app._router.stack);
