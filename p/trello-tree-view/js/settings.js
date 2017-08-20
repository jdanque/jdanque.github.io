
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var theme = document.getElementById('theme');
var expandupto = document.getElementById('expandupto');

t.render(function(){
  return Promise.all([
    t.get('board', 'private', 'theme')
    t.get('board', 'private', 'expandupto')
  ])
  .spread(function(savedTheme,savedExpandUpto){
    if(savedTheme && /[a-z]+/.test(savedTheme)){
      theme.value = savedTheme;
    }
    if(savedExpandUpto && /[a-z]+/.test(savedExpandUpto)){
      expandupto.value = savedExpandUpto;
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