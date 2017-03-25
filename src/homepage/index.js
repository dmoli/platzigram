// modulo para gestionar rutas
var page = require('page');
// para eliminar html
var empty = require('empty-element');
// requiere el modulo de template para obtener el html
var template = require('./template');
// cambia el titulo
var title = require('title');
// superagent to HTTP request like Ajax, but with less sucks
var request = require('superagent');
// axios to HTTP request like Ajax, but based promise
var axios = require('axios');
// get loadHome module
var loadHome = require('../load-home');
// get header module
var header = require('../header');
var picture = require('../picture-card');
var utils = require('../utils');
var io = require('socket.io-client');

var socket = io('http://localhost:5151') // listen and emit

// cambiar html de home
// middleware: can to have any functions like params
// ctx: allow share vars with other functions. Ex. ctx.pictures
page('/', utils.loadAuth, header, loadHome, loadPictures, function(ctx, next){
	// establecemos el titulo
	title('Platzigram');

	// obtenemos el main container
	var main = document.getElementById('main-container');

	// agregamos el html dentro del #main-container
	empty(main).appendChild(template(ctx.pictures));
})

// listen image changes
socket.on('image', function (image) {
	var imagesList = document.getElementById('imagesList');
  imagesList.insertBefore(picture(image), imagesList.firstChild);
})

// get data with axios
function loadPictures(ctx, next) {
 	axios
 		.get('/api/pictures')
 		.then(function (res) {
 			ctx.pictures = res.data;
 			// call the next function
 			next();
 		})
 		.catch(function (err) {
 			console.log(err);
 		})
}

// get data with asyncawait, note: nto support by safari
/*
async function loadPictures(ctx, next) {
	try {
		// await: stop process until that promise is executed 
		// ctx.pictures = await fetch('/api/pictures').then(res => res.json());
		ctx.pictures = await fetch('/api/pictures').then(res => res.json());
		next();
	} catch (err) {
		return console.log(err);
	}
 }
*/

/*
// get data with fetch
function loadPictures(ctx, next) {
 	fetch('/api/pictures')
 		.then(function (res) {
 			// only response
 			return res.json();
 		})
 		// pictures is return res.json()
 		.then(function (pictures) {
 			// management response
 			ctx.pictures = pictures;
 			// call the next function
 			next();
 		})
 		.catch(function (err) {
 			console.log(err);
 		})
 }
*/

/*
// get data with superagent
function loadPictures(ctx, next) {
 	request
 		.get('/api/pictures')
 		.end(function (err, res) {
 			if (err) {
 				return console.log(err);
 			}
 			ctx.pictures = res.body;
 			// call the next function
 			next();
 		})
}
*/