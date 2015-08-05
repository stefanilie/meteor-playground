Searches = new Mongo.Collection('searches')
Tweets = new Mongo.Collection('tweets')
Posts = new Mongo.Collection('posts')
var twitter = new TwitterApi()
// 42217566.5925b3e.43cbb5c3dd1f441eb2fa1e8d7eaa8217
Meteor.methods({
  'getRelatedTags': function (text, accessToken) {
    check(text, String)
    check(accessToken, String)

    try {
      var result = HTTP.call('GET', 'https://api.instagram.com/v1/tags/search',
        {params: {q: text, access_token: accessToken}}
      )
      // console.log(result)
      return result
    } catch (e) {
      return null
    }
  },

  'getPosts': function (text, accessToken) {
    check(text, String)
    check(accessToken, String)

    try {
      var url = 'https://api.instagram.com/v1/tags/' + text + '/media/recent?access_token=+' + accessToken
      var result = HTTP.call('GET', url)
      // console.log(result)

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
      }

      // getting the embeded posts
      console.log('am intrat in getEmbed')
      // TODO: Add if clause if post is picture or if post is video
      var defaultLink = 'http://instagr.am/p/'
      var result = []
      var url = 'http://api.instagram.com/oembed?url='
      for (var i = 0; i < arrayOfLinks.length; i++) {
        // console.log(url + defaultLink + arrayOfLinks[i])
        var answer = HTTP.call('GET', url + defaultLink + arrayOfLinks[i])
        answer = JSON.parse(answer['content'])['html']
        result.push(answer)
      }
      return result
    } catch (e) {
      return null
    }
  },

  'tweeterSearch': function (term) {
    try {
      var arrOfIDs = []
      var results = []
      var id
      var array = twitter.search(term)
      var content = JSON.parse(array['content'])
      content = content['statuses']
      // console.log(content['statuses'])
      // array = array['statuses']
      console.log("sunt in twitter");
      for (var i = 0; i < content.length; i++) {
        id = content[i]['id_str']
        var rawEmbed = twitter.callAsApp('GET', 'statuses/oembed.json', {id: id})
        rawEmbed = JSON.parse(rawEmbed['content'])
        Tweets.insert({
          searched: term,
          html: rawEmbed['html']
        })

      // TODO: Find a way to make this shite work
      // var tweet = {
      //   searched: term,
      //   hmtl: rawEmbed['html']
      // }
      // Meteor.publish('tweetSearch', function () {
      //   var init = true
      //   var self = this
      //   _.each(results, function (result) {
      //     if (init) {
      //       self.added('tweets', Random.id(), tweet)
      //       init = false
      //     } else {
      //       self.changed('tweets', Random.id(), tweet)
      //     }
      //   })
      //   self.ready()
      //   init = false
      // })
      // results.push({html: rawEmbed['html']})
      }
      console.log(results)
      return results
    } catch(e) {
      console.log(e)
      return null
    }

  }
})
