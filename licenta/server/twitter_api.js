// TwitterApi = function(options) {
//   this._url = "https://api.twitter.com";
//   this._version = "1.1";
//   this.app_auth_token = "";
//   if (options) _.extend(this, options);
// };
//
// TwitterApi.prototype._getUrl = function(url){
//   return [this._url, this._version, url].join('/');
//
//   //https://api.twitter.com/1.1/search/tweets.json
// };
//
// TwitterApi.prototype.callAsApp = function(method, url, params){
//
//   this.createApplicationToken();
//
//   result = Meteor.http.call(method,
//     this._getUrl(url), {
//     params : params,
//     headers : {
//       'Authorization': 'Bearer ' + this.app_auth_token
//     }
//   });
//
//   return result;
// };
//
// TwitterApi.prototype.createApplicationToken = function() {
//   var url = 'https://api.twitter.com/oauth2/token'
//   var config = Accounts.loginServiceConfiguration.findOne({service: 'twitter'});
//   var base64AuthToken = new Buffer(config.consumerKey + ":" + config.secret).toString('base64');
//
//   var result = Meteor.http.post(url, {
//     params: {
//       'grant_type': 'client_credentials'
//     },
//     headers: {
//       'Authorization': 'Basic ' + base64AuthToken,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//     }
//   });
//   this.app_auth_token = result.data.access_token;
//   return this.app_auth_token;
// };
//
//
// TwitterApi.prototype.search = function (query) {
//
//   return this.callAsApp('GET', 'search/tweets.json', {
//     'q': query
//   });
// };
