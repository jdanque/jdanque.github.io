
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var theme = document.getElementById('theme');

t.render(function(){
  return Promise.all(
    t.get('board', 'private', 'theme')
  ).then(function(savedTheme){
    if(savedTheme && /[a-z]+/.test(savedTheme)){
      theme.value = savedTheme;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('board', 'private', 'theme', theme.value)
  .then(function(){
    t.closePopup();
  });
});