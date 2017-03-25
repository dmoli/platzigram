// modulo para gestionar vistas, transforma string a elementos html
var yo = require('yo-yo');
// export index.js
var landing = require('../landing'); 
// export lenguage
var translate = require('../translate');

var signupForm = yo`<div class="col s12 m7">
						<div class="row">
							<div class="signup-box">
								<h1 class="platzigram">Platzigram</h1>
								<form class="signup-form" action="signup" method="POST">
									<h2>${translate.message('SIGNUP.SUBHEADING')}</h2>
									<div class="section">
										<a class="btn btn-fb hide-on-small-only">${translate.message('SIGNUP.FACEBOOK')}</a>
										<a class="btn btn-fb hide-on-med-and-up"><i class="fa fa-facebook-official" aria-hidden="true"></i> ${translate.message('SIGNUP.TEXT')}</a>
									</div>
									<div class="divider"></div>
									<div class="section">
										<input type="text" name="email" placeholder="${translate.message('EMAIL')}" value="skumblue@gmail.com" />
										<input type="text" name="name" placeholder="${translate.message('FULLNAME')}" value="Diego Molina"/>
										<input type="text" name="username" placeholder="${translate.message('USERNAME')}" value="skumblue"/>
										<input type="password" name="password" placeholder="${translate.message('PASSWORD')}" value="1234"/>
										<button class="btn waves-effect waves-light btn-signup" type="submit">${translate.message('SIGNUP.CALL-TO-ACTION')}</button>
									</div>
								</form>
							</div>
						</div>
						<div class="row">
							<div class="login-box">
								${translate.message('SIGNUP.HAVE-ACCOUNT')} <a href="/signin">${translate.message('SIGNIN')}</a>
							</div>
						</div>
					</div>`;

module.exports = landing(signupForm);



