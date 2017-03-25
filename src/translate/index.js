// is null or undefined (to Safari browser)
if (!window.Intl) {
  window.Intl = require('intl'); //polyfill
  require('intl/locale-data/jsonp/en-US.js');
  require('intl/locale-data/jsonp/es.js');
}

// get relative date format
var IntlRelativeFormat = window.IntlRelativeFormat = require('intl-relativeformat');
// get message text format
var IntlMessageFormat = require('intl-messageformat');

// requiere two lenguage
require('intl-relativeformat/dist/locale-data/en.js');
require('intl-relativeformat/dist/locale-data/es.js');

// export message for each lenguage
var es = require('./es.js');
var en = require('./en-US.js');

// assign var
var MESSAGES = {};
MESSAGES.es = es;
MESSAGES['en-US'] = en;

// set lenguage
var locale = localStorage.locale || 'es';

module.exports = {
	message: function (text, opts) {
		opts = opts || {};
		var msg = new IntlMessageFormat(MESSAGES[locale][text], locale, null);
		return msg.format(opts);
	},
	date: new IntlRelativeFormat(locale)
}


