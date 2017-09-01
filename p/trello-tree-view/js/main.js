var API_KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';
var ICON = 'https://jdanque.github.io/p/trello-tree-view/img/logo_white.svg?v=1.0.0';

var openTreeViewOverlay = function (t, opts) {

	t.get('board', 'private', 'theme').then(function(_accentColor){

		_accentColor = _accentColor.split("-")[1];
		var colorWeight = (_accentColor === 'gray') ? 200 : 600;
		_accentColor = window.TrelloPowerUp.util.colors.getHexString(_accentColor, colorWeight);
	  return t.modal({
		url: 'https://jdanque.github.io/p/trello-tree-view/view/treeview.html?v=1.0.0',
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
			url: 'https://jdanque.github.io/p/trello-tree-view/view/auth.html?v=1.0.0',
			height: 140,
		});
	},
	'show-settings': function(t, options){
		return t.popup({
			title: 'TreeView Settings',
			url: 'https://jdanque.github.io/p/trello-tree-view/view/settings.html?v=1.0.0',
			height: 184
		});
	}

});