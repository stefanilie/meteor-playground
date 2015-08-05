Searches = new Mongo.Collection('searches')
Tweets = new Mongo.Collection('tweets')
Posts = new Mongo.Collection('posts')
// Meteor.subscribe('tweetSearch')
// Meteor.loginWithInstagram(function (err, res) {
//   if (err !== undefined)
//     console.log('sucess ' + res)
//   else
//     console.log('login failed ' + err)
// })
Template.body.helpers({
  searches: function () {
    return Searches.find()
  },
  tweets: function () {
    return Tweets.find()
  },
  posts: function(){
    return Posts.find()
  }
})

Template.body.events({
  'submit .searched': function (event) {
    Searches.
    event.preventDefault()

    var text = event.target.text.value
    var accessToken = ''
    var userName = ''
    if (Meteor.user().services.facebook) {
      userName = Meteor.user().services.facebook.name
    } else if (Meteor.user().services.instagram) {
      userName = Meteor.user().services.instagram.username
      accessToken = Meteor.user().services.instagram.accessToken
    } else if (Meteor.user().services.twitter) {
      userName = Meteor.user().services.twitter.screenName
    // accessToken = Meteor.user().services.twitter.
    }

    // Tweets.remove({})

    Searches.insert({
      text: text,
      user: userName,
      createdAt: new Date()
    })
    // 1P5P6iQfU5Oo7APMXlht9K6eC:3q3QME7rlcs9Pxk3kX1OUKBddmY21RcSdo9p4yed0cUW9ihcZP
    // MVA1UDZpUWZVNU9vN0FQTVhsaHQ5SzZlQzozcTNRTUU3cmxjczlQeGsza1gxT1VLQmRkbVkyMVJjU2RvOXA0eWVkMGNVVzlpaGNaUA==
    // api.twitter.com/oauth2/token
    // TODO: Refactor the following three methods into one beautiful method.
    // Meteor.call("getRelatedTags", text, accessToken, function(err, results) {
    //    console.log(JSON.parse(results.content)['data'])
    // })
    Meteor.call('getPosts', text, accessToken, function (err, result) {
      console.log(result)
      for (var i = 0; i < result.length; i++) {
        Posts.insert({
          query: text,
          html: result[i]
        })
      // arrayOfLinks.push(arrEmbeded[i]['html'])
      }
    })
    // console.log(arrayOfLinks)
    // Meteor.call('tweeterSearch', '#' + text, function (err, results) {
    //   if (!err){
    //     console.log(results)
    //   }
    // })

    event.target.text.value = ''
  }
})
