var t = TrelloPowerUp.iframe();

t.get('card','shared','rank').then(function(data){
	window.rankcurrent.value = data || 0;
});

t.cards('all').then(function(data){
	window.rcards = data;
});


window.rankcard.addEventListener('submit',function(ev){
	ev.preventDefault();
	return t.set('card','shared','rank', window.rankcurrent.value)
	.then(function(){
		t.closePopup();
	});
});

window.rankup.addEventListener('click',function(ev){
	var v = 1 + parseInt(window.rankcurrent.value);
//	if(v<=window.rcards.length)
		window.rankcurrent.value = v;
});

window.rankdown.addEventListener('click',function(ev){
	var v = 1 - parseInt(window.rankcurrent.value);
//	if(v>-1)
		window.rankcurrent.value = v;
});