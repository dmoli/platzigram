// modulo para gestionar vistas, transforma string a elementos html
var yo = require('yo-yo');

// obtemos la master page
var layout = require('../layout');

// obtenemos el template de la foto
var picture = require('../picture-card');

// get translate
var translate = require('../translate');

// superagent to HTTP request like Ajax, but with less sucks
var request = require('superagent');

module.exports = function(pictures) {
	var el =  yo`
		<div class="container timeline">
			<div class="row">
				<div class="col s12 m10 offset-m1 offset-12 center-align">
					<form id="formUpload" enctype="multiplart/form-data" class="form-upload" onsubmit=${onsubmit}>
						<div id="loaderImage" class="loader-image hide">
							<div class="loader"></div>
						</div>
						<div id="fileName" class="fileUpload btn btn-flat cyan">
							<span><i class="fa fa-camera"></i> ${translate.message('UPLOAD-PICTURE')}</span>
							<input name="picture" id="file" type="file" class="upload" onchange=${onchange}/>
						</div>
						<button id="btnUpload" type="submit" class="btn btn-flat cyan hide">${translate.message('UPLOAD')}</button>
						<button id="btnCancel" type="button" class="btn btn-flat red hide" onclick=${cancel}><i class="fa fa-times"></i></button>
					</form>
				</div>
			</div>
			<div class="row">
				<div id="imagesList" class="col s12 m10 offset-m1 l6 offset-l3">
					${pictures.map(function(pic) {
						return picture(pic);
					})}
				</div>
			</div>
		</div>
	`;

	// when change button status
	function onchange() {
		toggleButtons();
	}
 	
 	// when press cancel button
	function cancel() {
		toggleButtons();
		document.getElementById('formUpload').reset();
	}

 	// when change button status
 	function toggleButtons() {
 		document.getElementById('fileName').classList.toggle('hide');
		document.getElementById('btnUpload').classList.toggle('hide');
		document.getElementById('btnCancel').classList.toggle('hide');
 	}

 	// on submit form
 	function onsubmit(ev) {
 		// no execute de default
 		ev.preventDefault();

 		// this: form
 		var data = new FormData(this);
 		document.getElementById('loaderImage').classList.toggle('hide');
 		// send to server
 		request
      .post('/api/pictures')
      .send(data)
      .end(function (err, res) {
        document.getElementById('loaderImage').classList.toggle('hide');
        cancel();
        if (err) return console.log(err)
      })
 	}

	// exportamos el html dentro de la master page
	return layout(el);
}