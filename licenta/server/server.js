Searches = new Mongo.Collection('searches');
//42217566.5925b3e.43cbb5c3dd1f441eb2fa1e8d7eaa8217
Meteor.methods({
  'getRelatedTags': function(text, accessToken){
      check(text, String);
      check(accessToken, String);

      try{
        var result = HTTP.call("GET", "https://api.instagram.com/v1/tags/search",
                      {params: {q: text, access_token: accessToken}}
                    );
        //console.log(result);
        return result;
      } catch (e) {
        return null;
      }
  },
  'getPosts': function(text, accessToken){
      check(text, String);
      check(accessToken, String);

      try{
        var url = "https://api.instagram.com/v1/tags/"+text+"/media/recent?access_token=+"+accessToken;
        var result = HTTP.call("GET", url);
        //console.log(result);
        return result;
      } catch (e) {
        return null;
      }
  },
  'getEmbed': function(arrayOfLinks){

    try {
      // TODO: Add if clause if post is picture or if post is video
      var defaultLink = "http://instagr.am/p/";
      var arrEmbeded = [];
      var url = "http://api.instagram.com/oembed?url=";
      for (var i = 0; i < arrayOfLinks.length; i++) {
        console.log(url+defaultLink+arrayOfLinks[i]);
        var result = HTTP.call("GET", url + defaultLink +arrayOfLinks[i]);

        arrEmbeded.push(result);
      }
      return result;
    } catch (e) {
      return null;
    }
  }
});
