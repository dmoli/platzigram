var yo = require('yo-yo');
var empty = require('empty-element');

var el = yo`
	<div class="loader"></div>
`;

module.exports = function loadHome (ctx, next) {
	var container = document.getElementById('main-container');
	empty(container).appendChild(el);
	next();
}