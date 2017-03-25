var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var header = require('../header');
var utils = require('../utils');

page('/:username', loadUser, utils.loadAuth, header, function (ctx, next) {
  console.log(':username')
  var main = document.getElementById('main-container');
  title(`Platzigram - ${ctx.user.username}`);
  empty(main).appendChild(template(ctx.user));
});

page('/:username/:id', loadUser, utils.loadAuth, header, function (ctx, next) {
  console.log(':username/:id')
  var main = document.getElementById('main-container');
  title(`Platzigram - ${ctx.user.username}`);
  empty(main).appendChild(template(ctx.user));

  // open modal
  $(`#modal${ctx.params.id}`).openModal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    complete: function () {
      page(`/${ctx.params.username}`)
    }
  });

});

// get user
function loadUser(ctx, next) {
	request
 		.get(`/api/user/${ctx.params.username}`)
 		.end(function (err, res) {
 			if (err) {
 				return console.log(err);
 			}
      console.log(res.body)
 			ctx.user = res.body;
 			// call the next function
 			next();
 		})
}
