var LocalStrategy = require('passport-local').Strategy; // auth local (user, password)
var FacebookStrategy = require('passport-facebook').Strategy; // auth facebook
var platzigram = require('platzigram-client'); // api
var jwt = require('jsonwebtoken');
var config = require('../config') // config
var client = platzigram.createClient(config.client); // client object

// strategy auth local
exports.localStrategy = new LocalStrategy((username, password, done) => {
  console.log('1. localStrategy')
  client.auth(username, password, (err, token) => {
    if (err) {
      return done(null, false, { message: 'username and password not found' })
    }
    client.getUser(username, (err, user) => {
      if (err) {
        return done(null, false, { message: `an error ocurred: ${err.message}` })
      }
      console.log('2. get user from API')
      user.token = token;
      return done(null, user);
    })
  })
})

// auth Facebook
exports.facebookStrategy = new FacebookStrategy({
  clientID: config.auth.facebook.clientID,
  clientSecret: config.auth.facebook.clientSecret,
  callbackURL: config.auth.facebook.callbackURL,
  profileFields:[ 'id', 'displayName', 'email' ]
}, function (accessToken, refreshToken, profile, done) {
  console.log('1. facebookStrategy')
  // accessToken: provider by Facebook, life time short
  // refreshToken: request new access token to Facebook, life time long
  // note: accessToken and refreshToken are used by passport automatically
  var userProfile = {
    username: profile._json.id,
    name: profile._json.name,
    email: profile._json.email,
    facebook: true
  }
  // return user from own API to Facebook
  findOrCreate(userProfile, (err, user) => {
    console.log('3. callback userProfile')
    if (err) return done(err);
    // create a token like the same way as API auth.js
    jwt.sign({ userId: user.username}, config.secret, {}, (e, token) => {
      console.log('4. create token')
      if (e) return done(e);
      user.token = token;
      return done(null, user);
    })
  })

  // if not exist, then create it 
  function findOrCreate(user, callback) {
    client.getUser(user.username, (err, usr) => {
      // not exist
      if (err) {
        console.log('2.a create')
        return client.saveUser(user, callback);
      }
      console.log('2.b exist')
      // exist (error = null)
      return callback(null, usr);
    })
  }
})

// receive complete object user and save only one reference
exports.serializeUser = function (user, done) {
  console.log('3. save reference')
  done(null, {
    username: user.username,
    token: user.token
  })
}

// get a reference and return the complete user
exports.deserializeUser = function (user, done) {
  console.log('4. get complete user')
  client.getUser(user.username, (err, usr) => {
    usr.token = user.token;
    // usr is save into req.user
    done(err, usr);
  })
}
