
var OAuth = require('oauth');
var crypto = require('crypto');
var rest = require('restler');

var OAuth2 = OAuth.OAuth2;
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

var oauth2 = new OAuth2(client_id,
 client_secret,
 'https://sauth.webtrends.com/',
 'v1/oAuth/login',
 'v1/token',
 null);

function jwt_assertion(account_id){
  var claims = jwt_claims(account_id);
  var payload = jwt_header()+"."+claims;
  var signature = crypto.createHmac('SHA256', process.env.CLIENT_SECRET).update(payload).digest('base64');
  return payload + "." + signature;
}

function jwt_header(){
  var json = {
    typ: "JWT",
    alg: "HS256"
  };
  return new Buffer(JSON.stringify(json)).toString('base64');
}

function jwt_claims(account_id){
  var json = {
    iss: process.env.CLIENT_ID,
    prn: process.env.CLIENT_ID,
    aud: "auth.webtrends.com",
    exp: new Date().getTime() + 30*60*1000,
    scope: "sapi.webtrends.com",
    aid: process.env.ACCOUNT_ID,
    uid: process.env.USER_ID
  };
  return new Buffer(JSON.stringify(json)).toString('base64');

}

function execute(account_id,callback){
  var assertion = jwt_assertion(account_id);
  var options = {
      client_id: process.env.CLIENT_ID,
      client_assertion: assertion
  };

  rest.post("https://sauth.webtrends.com/v1/token",{
    data: options
  }).on('complete', function(data, response) {
    callback(data.access_token);
  });
}

module.exports = {
  token: function(account_id,callback){
    execute(account_id,callback);
  }
}