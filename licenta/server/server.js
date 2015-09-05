Searches = new Mongo.Collection('searches')
// Tweets = new Mongo.Collection('tweets')\
// Posts = new Mongo.Collection('posts')
var twitter = new TwitterApi()
Meteor.methods({
  'getRelatedTags': function(text, accessToken) {
    check(text, String)
    check(accessToken, String)
    console.log("Getting related hashtags for "+text);
    try {
      var result = HTTP.call('GET', 'https://api.instagram.com/v1/tags/search', {
          params: {
            q: text,
            access_token: accessToken
          }
        })
      return JSON.parse(result.content)['data']
    } catch (e) {
      console.log(e);
      return "error"
    }
  },

  'getPosts': function(text, accessToken) {
    check(text, String)
    check(accessToken, String)
    try {
      console.log("Getting instagram posts:");
      var url = 'https://api.instagram.com/v1/tags/' + text +
       '/media/recent?access_token=+' + accessToken

      var result = HTTP.call('GET', url)
      console.log("* searched for "+text);

      // parsing the result so that we can call for the htmls
      var response = JSON.parse(result.content)['data']

      // getting the ids of the posts
      var arrayOfLinks = []

        // var arrayOfEmbed = []
      for (var i = 0; i < response.length; i++) {
        var toAdd = response[i]['link']
        var start = toAdd.length - 11
        toAdd = toAdd.slice(start)
        toAdd = toAdd.substring(0, toAdd.length - 1)
        arrayOfLinks.push(toAdd)
        console.log("*added link: "+toAdd);
      }

      // getting the embeded posts
        // TODO: Add if clause if post is picture or if post is video
      var defaultLink = 'http://instagr.am/p/'
      var result = []
      var url = 'http://api.instagram.com/oembed?url='
      try {
        for (var i = 0; i < arrayOfLinks.length; i++) {
          // console.log(url + defaultLink + arrayOfLinks[i])
          var answer = HTTP.call('GET', url + defaultLink + arrayOfLinks[i])
          console.log("* got instagram embed code");
          answer = JSON.parse(answer['content'])['html']
          result.push(answer)
        }
        return result
      } catch (ex) {
        console.log(ex);
        return result;
      }
    } catch (e) {
      console.log(e);
      return null
    }
  },

  // TODO: make validation for tweets if it
  //alreadyexists not to be shown
  'tweeterSearch': function(term) {
    try {
      console.log("Getting twitter posts");
      var connections = {}
      var results = []
      var id
      var array = twitter.search(term)
      console.log("* searched for "+term);
      var content = JSON.parse(array['content'])
      content = content['statuses']

      for (var i = 0; i < content.length; i++) {
        id = content[i]['id_str']
        var rawEmbed = twitter.callAsApp('GET', 'statuses/oembed.json', {
          id: id
        })
        console.log("* got tweet embed code...");
        rawEmbed = JSON.parse(rawEmbed['content'])
          // Tweets.insert({
          //   searched: term,
          //   html: rawEmbed['html']
          // })

        results.push(rawEmbed['html'])
      }

      // TODO: Find a way to make this shite work
      // var tweet = {
      //   searched: term,
      //   data: results
      // }
      // Meteor.publish('tweetPublication', function() {
      //   var init = true
      //   var subscription = this
      //
      //   connections[subscription._session.id] = subscription
      //
      //   subscription.added('tweets', Random.id(), tweet)
      //
      //   subscription.onStop(function(){
      //     delete connections[subscription._session.id]
      //   })
      // })
      console.log(results)
      return results
    } catch (e) {
      console.log(e)
      return null
    }

  }
})
