var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function(pic) {
  var el;

  // return html
  function render(pic) {
    return yo`
    <div class="card ${pic.liked ? 'liked' : ''}">
      <div class="card-image">
        <img class="activator" src="${pic.src}">
      </div>
      <div class="card-content">
        <a href="/${pic.user.username}" class="card-title">
          <img src="${pic.user.avatar}" class="avatar" />
          <span class="username">${pic.user.username}</span>
        </a>
        <small class="right time">${translate.date.format(new Date(pic.createdAt).getTime())}</small>
        <p>
          <a class="left" href="#" onclick=${like.bind(null, true)}><i class="fa fa-heart-o"></i></a>
          <a class="left" href="#" onclick=${like.bind(null, false)}><i class="fa fa-heart"></i></a>
          <span class="left likes">${translate.message('LIKES', { likes: pic.likes })}</span> 
        </p>
      </div>
    </div>`;
  }

  /**
  like.bind(null, true) = null es el objeto this, y true el parametro a utilizar en "like"
  bind retorna una funcion para que cuando se haga click, recién sea llamada
  */

  // click like
  function like(liked) {
    pic.liked = liked;
    pic.likes += liked ? 1 : -1;
    var newEl = render(pic);
    // metodo que actualiza un elemento (antiguo, nuevo )
    yo.update(el, newEl);
    return false;
  }

  // retornamos el html de cada foto
  el = render(pic);
  return el;
} 