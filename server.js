var express = require('express'); // load express module
var app = express(); // create app
var multer  = require('multer'); // upload files
var ext = require('file-extension'); // get file extension
var aws  = require('aws-sdk'); // upload files with s3
var multerS3  = require('multer-s3'); // save auth data in a cookie (passport js make it automatically) 
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser') // parser http request
var expressSession = require('express-session') // save session data in side-server, for after get by a cookie
var passport = require('passport') // passport
var platzigram = require('platzigram-client')
var config = require('./config'); // environment vars
var port = config.port;
var auth = require('./auth') // auth
var client = platzigram.createClient(config.client); // instantiate

/**
* Middleware
*/
app.use(express.static('public')); // allow public folder
app.set('view engine', 'pug'); // set pug (ex jade)

// passport.js config
app.set(bodyParser.json()); // serialize request to json
app.use(bodyParser.urlencoded({ extended: false })); // (middleware) receive form params
app.use(cookieParser());
app.use(expressSession({
	secret: config.secret, // secret key to ecode session params
	resave: false, // save session once
	saveUnitialized: false // dont save unitialized session
}))
app.use(passport.initialize()); // tell to express that we will to work with passport 
app.use(passport.session()); // tell to express that we will to work with session passport 
passport.use(auth.localStrategy);
passport.use(auth.facebookStrategy);
passport.deserializeUser(auth.deserializeUser);
passport.serializeUser(auth.serializeUser);

/**
* AWS
*/
var s3 = new aws.S3({ // define s3
	accessKeyId: config.aws.accessKey,
	secretAccessKey: config.aws.secretKey
});
var storage = multerS3({ // set the destination to upload
	s3: s3,
	bucket: 'platzigram-skumblue',
	acl: 'public-read', // access list
	metadata: function (req, file, cb) {
		cb(null, { fieldName: file.fieldname })
	},
	key: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + '.' + ext(file.originalname));
	}
});
var upload = multer({ storage: storage }); // upload files

/**
* Routes
*/
// redirect to /views/index.pug
app.get('/', function(req, res){
	res.render('index')
})

// redirect to /views/index.pug
app.get('/signup', function(req, res){
	res.render('index')
})

// signup form
app.post('/signup', function (req, res) {
	var user = req.body; // i can use as json, thank to middleware bodyParser
	client.saveUser(user, function(err, data) {
		if (err) return res.status(500).send(err.message)
		res.redirect('/signin');
	})
})

// redirect to /views/index.pug
app.get('/signin', function(req, res){
	res.render('index')
})

// signin form
app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

// facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/signin'
}));

// logout
app.get('/logout', function (req, res) {
	req.logout()
	res.redirect('/signin');
})

// middleware to ensure that user is logged 
function ensureAuth (req, res, next) {
	// passport add automatically to req object the function "isAuthenticated"
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(401).send({ error: 'not authenticated' });
}

app.get('/whoami', function (req, res) {
	if (req.isAuthenticated()) {
		return res.json(req.user);
	}
	res.json({ auth: false });
})

// api get pictures
app.get('/api/pictures', function(req, res, next) {
	client.listPictures(function (err, pictures) {
		// if (err) return res.status(500).send(err.message);
		if (err) return res.send([]);

		res.send(pictures);
	})
})

// api upload file
app.post('/api/pictures', ensureAuth, function (req, res) {
	// picture is a input name
	upload.single('picture')(req, res, function (err) {
		if (err) {
			return res.status(500).send({ error: err.message });
		}

		var user = req.user; // is provider by passport.js automatically
		var token = req.user.token; // is provider by passport.js automatically
		var src = req.file.location; // is provider by multer automatically
		var picture = {
			src: src,
			userId: user.username,
			liked: false,
			likes: 0,
			user: {
				username: user.username,
				avatar: user.avatar,
				name: user.name
			}
		}
		client.savePicture(picture, token, function (err, img) {
			if (err) return res.status(500).send(err.message);
			res.send(img);
		})
	});
});

// api get user
app.get('/api/user/:username', (req, res) => {
	client.getUser(req.params.username, function (err, user) {
		if (err) return res.status(404).send({ error: 'user not found' })
		client.listPicturesByUserId(req.params.username, function (err, pictures) {
			if (err) pictures = []

			user.pictures = pictures;
			res.send(user)
		})
	})
});

// redirect to /views/index.pug
app.get('/:username', function(req, res) {
	res.render('index', { title: `Platzigram - ${req.params.username}` });
});

// redirect to /views/index.pug (modal picture)
app.get('/:username/:id', function (req, res) {
  	res.render('index', { title: `Platzigram - ${req.params.username}` });
});

// start server
app.listen(port, function(err){
	if (err) return console.log('Error'), process.exit(1);
	console.log(`Platzigram en el puerto ${port}`);
})

/**
* notes:
* express read routes in cascading order
*/
