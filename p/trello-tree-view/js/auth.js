var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();
var r_url = encodeURIComponent('https://jdanque.github.io/p/trello-tree-view/view/auth-success.html?v=1.0.0');
//var r_url = encodeURIComponent('https://jdanque.github.io/p/trello-tree-view/view/auth-success.html');

var trelloAuthUrl = 'https://trello.com/1/authorize?expiration=never&name=Tree%20View%20for%20Trello&scope=read,write&key=e3e4df7f95e0b1942c0b82a9a2c301f6&callback_method=fragment&return_url='+r_url;

var tokenLooksValid = function(token) {
	return /^[0-9a-f]{64}$/.test(token);
}

document.getElementById('auth-btn').addEventListener('click', function(){
	t.authorize(trelloAuthUrl, { height: 680, width: 580, validToken: tokenLooksValid })
		.then(function(token){
			return t.set('member', 'private', 'token', token)
		})
		.then(function(){
			return t.closePopup();
		});
});