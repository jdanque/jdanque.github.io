
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var theme = document.getElementById('theme');
var expandupto = document.getElementById('expandupto');

t.render(function(){
  return t.get('board', 'private', 'theme')
  .then(function(savedTheme){
    if(savedTheme && /[a-z]+/.test(savedTheme)){
      theme.value = savedTheme;
    }
  })
  .then(function(savedexpandupto){
    if(savedexpandupto && /[a-z]+/.test(savedexpandupto)){
      expandupto.value = savedexpandupto;
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
    return t.set('board', 'private', 'expandupto', expandupto.value);
  })
  .then(function(){
    t.closePopup();
  });
});