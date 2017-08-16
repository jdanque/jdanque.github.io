var API_KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';
var ICON = 'https://d1ipfkx2xm6eh3.cloudfront.net/img/logo.svg';

var openTreeViewOverlay = function (t, opts) {
  return t.overlay({
//    url: 'https://d1ipfkx2xm6eh3.cloudfront.net/view/treeview.html',
	//todo
    url: './view/treeview.html',
    args: {} // optional args to pass
  });
};

TrelloPowerUp.initialize({

	'board-buttons': function (t, opts) {
		return [{
			icon: ICON,
			text: 'Trello Tree View',
			callback: openTreeViewOverlay
		}];
	},
	'authorization-status': function(t, options){
		return t.get('member', 'private', 'token')
			.then(function(authToken) {
				return { authorized: authToken != null }
			});
	},
	'show-authorization': function(t, options){
		return t.popup({
			title: 'Authorize Account',
			url: 'https://d1ipfkx2xm6eh3.cloudfront.net/view/auth.html',
			height: 140,
		});
	},
	'show-settings': function(t, options){
		return t.popup({
			title: 'Settings',
			url: 'https://d1ipfkx2xm6eh3.cloudfront.net/view/settings.html',
			height: 184
		});
	}

});