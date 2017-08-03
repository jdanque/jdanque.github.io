var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var APP_NAME = 'Trello Ranker';
var API_KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';

var oauthUrl = 'https://trello.com/1/authorize?'+
'callback_method=postMessage'+'&'+
'scope=read,write'+'&'+
'expiration=never'+'&'+
'name='+encodeURIComponent(APP_NAME)+'&'+
'key='+API_KEY+
'';

var tokenLooksValid = function(token) {
  return /^[0-9a-f]{64}$/.test(token);
}

var authorizeOpts = {
  height: 680,
  width: 580,
  validToken: tokenLooksValid
};


var authenticationSuccess = function() {
  window.content.value='Successful authentication';
};

var authenticationFailure = function() {
  window.content.value='Failed authentication';
};


var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', function() {
  t.authorize(oauthUrl, authorizeOpts)
  .then(function(token) {
    return t.set('member', 'private', 'token', token)
    .catch(t.NotHandled, function() {
      // fall back to storing at board level
      return t.set('board', 'private', 'token', token);
    });
  })
  .then(function() {
    // now that the token is stored, we can close this popup
    // you might alternatively choose to open a new popup
    return t.closePopup();
  });
});