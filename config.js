'use strict'

const config = {
  secret: process.env.PLATZIGRAM_SECRET,
  port: process.env.PORT,
  port_ws: process.env.PORT_WS,
	aws: {
		accessKey: process.env.AWS_ACCESS_KEY,
		secretKey: process.env.AWS_SECRET_KEY
	},
  client: {
    endpoints: {
      pictures: 'http://api.skumblue.com/picture',
      users: 'http://api.skumblue.com/user',
      auth: 'http://api.skumblue.com/auth'
    },
    ws: 'http://ws.skumblue.com'
  },
  auth: {
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://skumblue.com/auth/facebook/callback'
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  config.client.endpoints = {
    pictures: 'http://localhost:5000',
    users: 'http://localhost:5001',
    auth: 'http://localhost:5002'
  }
  config.auth.facebook.callbackURL = 'http://skumblue.test:5050/auth/facebook/callback';
  config.client.ws = `http://localhost:${config.port_ws}`;
}

module.exports = config;
