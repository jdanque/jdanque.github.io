var T = TrelloPowerUp.iframe(),
    Promise = TrelloPowerUp.Promise,
    authToken = null,
    card = null
    ;

T.get('member', 'private', 'token').then(function(val){
	authToken = val;
});

T.card('all').then(function(val){
	card = val;
});

T.get('card','shared','rank').then(function(data){
	window.rankcurrent.value = data || 0;
});

window.rankcard.addEventListener('submit',function(ev){
	ev.preventDefault();
	return T.set('card','shared','rank', window.rankcurrent.value)
	.then(function(){
		reOrderCards(T);

		var path = '';

//		Trello.rest('GET', path[, params], success, error)
//		console.log('new position');
//		console.log(window.rankcurrent.value);
		T.closePopup();
	});
});

window.rankup.addEventListener('click',function(ev){
	var v = parseInt(window.rankcurrent.value,10);
//	if(v<=window.rcards.length)
		window.rankcurrent.value = v+1;
});

window.rankdown.addEventListener('click',function(ev){
	var v = parseInt(window.rankcurrent.value,10);
	if(v!==0)
		window.rankcurrent.value = v-1;
});

var reOrderCards = function(t){

};
//	var newBoardCards = [];
//
//	var context = t.getContext();
//	var filters = "open";
//
//	t.card('id').then(function(cardId){
//		return new Promise()
//	})
//	t.get('member', 'private', 'token')
//		.then(function(token){
//		var url = context.list+"/cards/" +
//                filters +
//                "?"+
//                "token=" + token +
//                "&key=" + API_KEY;

		//Valid Values
		//for card filters: all, closed, none, open, visible.
//		window.Trello.lists.get(url,
//		    function(d){
//        		console.log(d);
//        	},
//        	function(){
//        });
//	});

//};