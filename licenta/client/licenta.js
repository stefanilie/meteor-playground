Searches = new Mongo.Collection('searches')
  // Tweets = new Mongo.Collection('tweets')
Tweets = new Mongo.Collection(null)
  // Posts = new Mongo.Collection('posts')
Posts = new Mongo.Collection(null)
Relateds = new Mongo.Collection(null)

  // Meteor.loginWithInstagram(function (err, res) {
  //   if (err !== undefined)
  //     console.log('sucess ' + res)
  //   else
  //     console.log('login failed ' + err)
  // })
Template.body.helpers({
  searches: function() {
    return Searches.find()
  },
  tweets: function() {
    return Tweets.find()
  },
  posts: function() {
    return Posts.find()
  },
  relateds: function() {
    return Relateds.find()
  }
})

Template.body.events({
  'submit .searched': function(event) {
    event.preventDefault()

    var text = event.target.text.value
    var accessToken = ''
    var userName = ''
      // if (Meteor.user().services.facebook) {
      //   userName = Meteor.user().services.facebook.name
    if (Meteor.user().services.instagram) {
      userName = Meteor.user().services.instagram.username
      accessToken = Meteor.user().services.instagram.accessToken
    }
    // } else if (Meteor.user().services.twitter) {
    //   userName = Meteor.user().services.twitter.screenName
    // // accessToken = Meteor.user().services.twitter.
    // }
    //
    // // Tweets.remove({})
    Searches.insert({
        text: text,
        user: userName,
        createdAt: new Date()
      })
      // TODO: Refactor the following three methods into one beautiful method.
    Meteor.call("getRelatedTags", text, accessToken, function(err, results) {
      console.log(results)
      if (Relateds.findOne({})) {
        Relateds.remove({})
      }
      for (var i = 0; i < results.length; i++) {
        Relateds.insert({
          hashtag: "#"+results[i]['name']
        });
      }
    })

    Meteor.call('getPosts', text, accessToken, function(err, result) {
      console.log(result)
      if (Posts.findOne({})) {
        Posts.remove({})
      }
      for (var i = 0; i < result.length; i++) {
        Posts.insert({
            query: text,
            html: result[i]
          })
          // arrayOfLinks.push(arrEmbeded[i]['html'])
      }
    })

    Meteor.call('tweeterSearch', text, function(err, results) {
      if (!err) {
        // console.log(results)
        if (Tweets.findOne({})) {
          Tweets.remove({})
        }
        for (var i = 0; i < results.length; i++) {
          console.log(results[i])
          Tweets.insert({
            html: results[i]
          })
        }
      }
    })

    event.target.text.value = ''
  }
})
