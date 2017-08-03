var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var APP_NAME = 'Trello Ranker';
var KEY = 'a6394dd0e3edbb531ad4d143c6a11ed5a0c3dd466c4e79ed2a62f8ca405ac99b';

// When constructing the URL, remember that you'll need to encode your
// APPNAME and RETURNURL
// You can do that with the encodeURIComponent(string) function
// encodeURIComponent('Hello World') -> "Hello%20World"
var oauthUrl = 'https://trello.com/1/authorize?expiration=never&name=SinglePurposeToken&key='+KEY;

var tokenLooksValid = function(token) {
  return /^[0-9a-f]{64}$/.test(token);
}

var authorizeOpts = {
  height: 680,
  width: 580,
  validToken: tokenLooksValid
};

var authBtn = document.getElementById('authorize');
authBtn.addEventListener('click', function() {
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