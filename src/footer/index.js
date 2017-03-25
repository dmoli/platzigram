var yo = require('yo-yo');
var translate = require('../translate');

var el = yo `
<footer class="site-footer">
  <div class="container">
    <div class="row">
      <div class="col s12 l3 center-align"><a href="#" data-activates="dropdown1" class="dropdown-button btn btn-flat">${translate.message('LANGUAGE')}</a>
        <ul id="dropdown1" class="dropdown-content">
          <li><a href="#" onclick=${lang.bind(null, 'es')}>${translate.message('SPANISH')}</a></li>
          <li><a href="#" onclick=${lang.bind(null, 'en-US')}>${translate.message('ENGLISH')}</a></li>
        </ul>
      </div>
      <div class="col s12 l3 push-l6 center-align">™ 2017 Platzigram</div>
    </div>
  </div>
</footer>`;

// change lenguage
function lang(locale) {
	localStorage.locale = locale;
	location.reload();
}

// inject to body
document.body.appendChild(el);