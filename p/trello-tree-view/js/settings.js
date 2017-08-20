
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var theme = document.getElementById('theme');
var expandupto = document.getElementById('expandupto');

t.render(function(){
  return Promise.all([
    t.get('board', 'private', 'theme'),
    t.get('board', 'private', 'expandupto')
  ])
  .spread(function(savedTheme,savedExpandUpto){
    if(savedTheme && /[a-z]+/.test(savedTheme)){
      $('.theme-tile').toggleClass('selectedtheme',false);
      $('.theme-tile[data-theme="'+savedTheme+'"]').toggleClass('selectedtheme',true);
    }
    if(savedExpandUpto){
      expandupto.value = savedExpandUpto;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

$(document).ready(function(){
	$('.theme-tile').on('click',function(e){
		$('.theme-tile').toggleClass('selectedtheme',false);
		$(this).toggleClass('selectedtheme',true);
	});
});

document.getElementById('save').addEventListener('click', function(){
	return new Promise(function(resolve){
		resolve($('.theme-tile.selectedtheme').attr('data-theme'));
	}).then(function(v){
		return t.set('board', 'private', 'theme', v);
	})
	.then(function(){
		return t.set('board', 'private', 'expandupto', expandupto.value);
	})
	.then(function(){
		t.closePopup();
	});
});