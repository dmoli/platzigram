// modulo para gestionar rutas
var page = require('page');
// para eliminar html
var empty = require('empty-element');
// requiere el modulo de template para obtener el html
var template = require('./template');
// cambia el titulo
var title = require('title');

// cambiar html de signup
page('/signin', function(ctx, next){
	title('Platzigram - Signin');
	// obtenemos el main container
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
})