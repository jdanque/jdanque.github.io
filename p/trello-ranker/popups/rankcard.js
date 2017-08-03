var t = TrelloPowerUp.iframe();
var Promise = window.TrelloPowerUp.Promise;

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
		reOrderCards(t);
		t.closePopup();
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

var reOrderCards = function(t){
	getMemberToken(t)
		.then(function(t){
			console.log(t);
			return getCardId(t);
		})
		.then(function(v){
			console.log(v);
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

};