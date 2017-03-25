// modulo para gestionar vistas, transforma string a elementos html
var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function layout(content) {
	return yo`
	<div>
		<div class="content">
			${content}
		</div>
	</div>`;
}