/* global TrelloPowerUp */
var GRAY_ICON = './images/icon-gray.svg';
var RANK_COLOR = 'green';
var RANK_ICON = 'https://cdn.glitch.com/c69415fd-f70e-4e03-b43b-98b8960cd616%2Frocket-ship-grey.png?1496162964717';

var cardButtonCallback = function(t){
  return t.popup({
    title: 'Rank this card',
    url: './popups/rank-card-popup.html'
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
          color: RANK_COLOR,
          text: rank ? ('Rank: '+ rank) : 'Rank: 0' && t.set('card','shared','rank', 0)
        }]
     });
  },
	'card-detail-badges': function(t, options) {
	  return t.get('card', 'shared', 'rank')
	  .then(function(rank) {
	    return [{
	      icon: RANK_ICON,
	      text: rank ? ('Rank: '+ rank) : 'Rank: 0' && t.set('card','shared','rank', 0),
	      color: RANK_COLOR,
	      callback: cardButtonCallback
	    }]
	  });
	}

});