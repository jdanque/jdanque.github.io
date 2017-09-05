var API_KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';
var ICON = 'https://d1ipfkx2xm6eh3.cloudfront.net/img/logo_white.png?v=1.6.2';

var openTreeViewOverlay = function (t, opts) {

	t.get('board', 'private', 'theme').then(function(_accentColor){
		_accentColor = (_accentColor !== undefined) ? _accentColor : 'theme-gray';
		_accentColor = _accentColor.split("-")[1];
		var colorWeight = (_accentColor === 'gray') ? 200 : 700;
		try{
			_accentColor = window.TrelloPowerUp.util.colors.getHexString(_accentColor, colorWeight);
		}catch(e){
			_accentColor = window.TrelloPowerUp.util.colors.getHexString('gray', 200);
		}
	  return t.modal({
		url: 'https://d1ipfkx2xm6eh3.cloudfront.net/view/treeview.html?v=1.6.2',
		fullscreen : false,
		title: 'TreeView for Trello',
		height: 500,
		accentColor : _accentColor
	  });
	});




};

TrelloPowerUp.initialize({

	'board-buttons': function (t, opts) {
		return [{
			icon: ICON,
			text: 'TreeView',
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
			url: 'https://d1ipfkx2xm6eh3.cloudfront.net/view/auth.html?v=1.6.2',
			height: 140,
		});
	},
	'show-settings': function(t, options){
		return t.popup({
			title: 'TreeView Settings',
			url: 'https://d1ipfkx2xm6eh3.cloudfront.net/view/settings.html?v=1.6.2',
			height: 184
		});
	}

});