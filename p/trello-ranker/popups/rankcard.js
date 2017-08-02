var t = TrelloPowerUp.iframe();

window.rankcard.addEventListener('submit',function(ev){
	ev.preventDefault();
	return t.set('card','shared','rank', window.rankcurrent.value)
	.then(function(){
		t.closePopup();
	});
});

window.rankup.addEventListener('click',function(ev){
	window.rankcurrent.value = parseInt(window.rankcurrent.value) + 1;
});

window.rankdown.addEventListener('click',function(ev){
	window.rankcurrent.value = parseInt(window.rankcurrent.value) - 1;
});