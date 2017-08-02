/* global TrelloPowerUp */
var GRAY_ICON = './images/icon-gray.svg';

var cardButtonCallback = function(t){
  return t.popup({
    title: 'Rank this card',
    url: './popups/rank-card-popup.html',
    callback: function(t){
//        return t.attach()
    }
  });
};

TrelloPowerUp.initialize({

  'card-buttons': function(t, options) {
    return [{
      icon: GRAY_ICON,
      text: 'Rank this card',
      callback: cardButtonCallback
    }];
  },
  'card-badges': function(t, options) {
    return t.get('card', 'shared', 'rank')
      .then(function(rank) {
        return [{
          icon: 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717',
          text: rank || '0'
        }];
     });
  },
	'card-detail-badges': function(t, options) {
	  return t.get('card', 'shared', 'rank')
	  .then(function(rank) {
	    return [{
	      title: 'Rank',
	      text: rank || '0',
	      callback: cardButtonCallback
	    }]
	  });
	}

});