
var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var theme = document.getElementById('theme');
var expandupto = document.getElementById('expandupto');
var showlabels = document.getElementById('show');
var showbadges = document.getElementById('expandupto');

t.render(function(){
  return Promise.all([
    t.get('board', 'private', 'theme'),
    t.get('board', 'private', 'expandupto'),
    t.get('board', 'private', 'showlabels'),
    t.get('board', 'private', 'showbadges')
  ])
  .spread(function(savedTheme,savedExpandUpto,showlabels,showbadges){
    if(savedTheme && /[a-z]+/.test(savedTheme)){
      $('.theme-tile').toggleClass('selectedtheme',false);
      $('.theme-tile[data-theme="'+savedTheme+'"]').toggleClass('selectedtheme',true);
    }
    if(savedExpandUpto){
      expandupto.value = savedExpandUpto;
    }
    if(showlabels !== null && showlabels != undefined){
      toggleItem($('#showlabels'), showlabels);
    }
    if(showbadges !== null && showbadges != undefined){
      toggleItem($('#showbadges'), showbadges);
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

	$('.toggle-item').on('click',function(e){
		var _this = $(this);
		var isEnabled = _this.attr('data-enabled') === "yes";

		toggleItem(_this, !isEnabled);
	});

});

function toggleItem(elem, isEnabled){
    var dataEnabled = isEnabled ? "yes" : "no";

    elem.attr('data-enabled',dataEnabled);
    elem.find('.toggle-item-text')
        .toggleClass("enabled",isEnabled)
        .toggleClass("disabled",!isEnabled);
    elem.find('.toggle-item-icon')
        .toggleClass("icon-check",isEnabled);
}


document.getElementById('save').addEventListener('click', function(){
	return new Promise.resolve($('.theme-tile.selectedtheme').attr('data-theme')
	).then(function(v){
		return t.set('board', 'private', 'theme', v);
	})
	.then(function(){
		return t.set('board', 'private', 'expandupto', expandupto.value);
	})
	.then(function(){
		return t.set('board', 'private', 'showlabels', $('#showlabels').attr('data-enabled') === "yes");
	})
	.then(function(){
		return t.set('board', 'private', 'showbadges', $('#showbadges').attr('data-enabled') === "yes");
	})
	.then(function(){
		t.closePopup();
	});
});