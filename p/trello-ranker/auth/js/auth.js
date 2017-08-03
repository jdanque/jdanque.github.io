var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var APP_NAME = 'Trello Ranker';
var KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';

// When constructing the URL, remember that you'll need to encode your
// APPNAME and RETURNURL
// You can do that with the encodeURIComponent(string) function
// encodeURIComponent('Hello World') -> "Hello%20World"
var oauthUrl = 'https://trello.com/1/authorize?+
'callback_method=postMessage'+'&'+
'return_url='+encodeURIComponent('https://jdanque.github.io')+'&'+
'scope=read,write'+'&'+
'expiration=never'+'&'+
'name='+encodeURIComponent(APP_NAME)+'&'+
'key'+KEY+
'';

var tokenLooksValid = function(token) {
  return /^[0-9a-f]{64}$/.test(token);
}

var authorizeOpts = {
  height: 680,
  width: 580,
  validToken: KEY
};


var authenticationSuccess = function() {
  window.content.value='Successful authentication';
};

var authenticationFailure = function() {
  window.content.value='Failed authentication';
};


var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', function() {

//	window.Trello.authorize({
//	  key : KEY,
//	  type: 'popup',
//	  name: 'Trello Ranker',
//	  scope: {
//	    read: 'true',
//	    write: 'true' },
//	  expiration: 'never',
//	  success: authenticationSuccess,
//	  error: authenticationFailure
//	});
console.log(oauthUrl);
  t.authorize(oauthUrl, authorizeOpts)
  .then(function(token) {
    return t.set('organization', 'private', 'token', token)
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