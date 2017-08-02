/* global TrelloPowerUp */

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
      text: 'Rank',
      callback: cardButtonCallback
    }];
  }

});