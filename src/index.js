// all proyect logic
// babel polyfill 
require('babel-polyfill');
// modulo para gestionar rutas
var page = require('page');
require('./header');
require('./homepage');
require('./signup');
require('./signin');
require('./user');
require('./footer');

// iniciar page
page();