var T = TrelloPowerUp.iframe();
var Promise = window.TrelloPowerUp.Promise;

T.get('card','shared','rank').then(function(data){
	window.rankcurrent.value = data || 0;
});

T.cards('all').then(function(data){
	window.rcards = data;
});


window.rankcard.addEventListener('submit',function(ev){
	ev.preventDefault();
	return T.set('card','shared','rank', window.rankcurrent.value)
	.then(function(){
		reOrderCards(T);
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


var getMemberToken = function(t){
	return t.get('member', 'private', 'token');
};

var getCardId = function(t){
	return t.card('id');
}

var token;
var cardid;

var reOrderCards = function(t){
console.log('passed here');
console.log(t.get('member', 'private', 'token'));
console.log(t.card('id'));
	return getMemberToken(t)
		.then(function(v){
			token = v;
			console.log(token);
			return getCardId(v);
		})
		.then(function(v){
			cardid = v;
			console.log(cardid);
		});
};



//var reOrderCards = function(t){
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