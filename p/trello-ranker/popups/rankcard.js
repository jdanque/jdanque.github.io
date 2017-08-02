var t = TrelloPowerUp.iframe();

var x = t.get('card','shared','rank');
console.log(x);

window.rankcard.addEventListener('submit',function(ev){
	ev.preventDefault();
	return t.set('card','shared','rank', window.rankcurrent.value)
	.then(function(){
		t.closePopup();
	});
});

window.rankup.addEventListener('click',function(ev){
	window.rankcurrent.value = 1 + parseInt(window.rankcurrent.value);
});

window.rankdown.addEventListener('click',function(ev){
	var v = parseInt(window.rankcurrent.value) - 1;
	if(v>-1)
		window.rankcurrent.value = parseInt(window.rankcurrent.value) - 1;
});