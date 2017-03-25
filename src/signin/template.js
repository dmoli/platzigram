// modulo para gestionar vistas, transforma string a elementos html
var yo = require('yo-yo');
// export index.js
var landing = require('../landing');
// export lenguages
var translate = require('../translate');

var signinForm = yo`<div class="col s12 m7">
						<div class="row">
							<div class="signup-box">
								<h1 class="platzigram">Platzigram</h1>
								<form class="signup-form" action="/login" method="post" >
									<div class="section">
										<a href="/auth/facebook" rel="external" class="btn btn-fb hide-on-small-only">${translate.message('SIGNUP.FACEBOOK')}</a>
										<a class="btn btn-fb hide-on-med-and-up"><i class="fa fa-facebook-official" aria-hidden="true"></i> ${translate.message('SIGNUP.TEXT')}</a>
									</div>
									<div class="divider"></div>
									<div class="section">
										<input type="text" name="username" placeholder="${translate.message('FULLNAME')}" value="skumblue" />
										<input type="password" name="password" placeholder="${translate.message('PASSWORD')}" value="1234" />
										<button class="btn waves-effect waves-light btn-signup" type="submit">${translate.message('SIGNIN')}</button>
									</div>
								</form>
							</div>
						</div>
						<div class="row">
							<div class="login-box">
								${translate.message('SIGNIN.NOT-HAVE-ACCOUNT')} <a href="/signup">${translate.message('SIGNUP.TEXT')}</a>
							</div>
						</div>
					</div>`;

module.exports = landing(signinForm);



