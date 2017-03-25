var gulp = require('gulp'); // automatizador
var sass = require('gulp-sass'); // permite usar compilar Sass 
var rename = require('gulp-rename'); // permite renombrar archivos
var babel = require('babelify'); // permite usar ES6
var browserify = require('browserify'); // ensamblador de nuestro código y código de paquetes externos
var source = require('vinyl-source-stream'); // source pasa de formato Browserify a formato Gulp, para que Gulp siga procesando el archivo
var watchify = require('watchify'); // escucha los cambios de archivos
// pipe: tareas para seguir el proceso

// tarea que convierte el archivo Sass a css
gulp.task('styles', function() {
	gulp
		.src('index.scss') // obtiene el archivo Sass
		.pipe(sass())
		.pipe(rename('app.css')) // renombra el archivo index.scss a app.css
		.pipe(gulp.dest('public')); // copia a la carpeta public
})

// tarea que copia todos los archivos de assets a public
gulp.task('assets', function(){
	gulp
		.src('assets/*')// glob: * expresiones regulares para apuntar archivos
		.pipe(gulp.dest('public')) // copia a la carpeta public
})

// compilara
function compile(watch){
	var bundle = browserify('./src/index.js', {debug: true});

	// se ecutará cuando watch llegue por parámetro
	if (watch) {
		// watchify retorna un objeto que nos permite escuchar cuando ocurran cambios
		bundle = watchify(bundle);

		// escuchar cambios de los archivos
		bundle.on('update', function(){
			console.log('--> Building...');
			rebundle();
		})
	}

	// realizará todo el build de los js
	function rebundle(){
		// tarea que une nuestro código (src/index.js) con el código de paquetes externos
		bundle
			.transform(babel, { presets: [ 'es2015' ], plugins: [ 'syntax-async-functions', 'transform-regenerator' ] }) // permite usar Ecmascript 6
			.bundle() // que lo procese y que genere el archivo
			.on('error', function(err) { console.log(err); this.emit('end'); })
			.pipe(source('index.js')) // source pasa de formato Browserify a formato Gulp, para que Gulp siga procesando el archivo
			.pipe(rename('app.js')) // renombra el archivo index.js a app.js
			.pipe(gulp.dest('public')); // copia a la carpeta public
	}

	rebundle();
}

// hará el build (esto es lo mismo que teníamos antes)
gulp.task('build', function(){ 
	return compile();
});

// hará el build y se quedará escuchando cambios
gulp.task('watch', function(){
	return compile(true);
});

// establece qué tareas debe hacer Gulp por default
gulp.task('default', ['styles', 'assets', 'build']);