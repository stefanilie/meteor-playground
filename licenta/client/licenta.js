Searches = new Mongo.Collection('searches')
  // Tweets = new Mongo.Collection('tweets')
Tweets = new Mongo.Collection(null)
  // Posts = new Mongo.Collection('posts')
Posts = new Mongo.Collection(null)
Relateds = new Mongo.Collection(null)

Template.related.events({
  'click .hashtag': function(){
    var text = this.hashtag.substr(1)
    if (Posts.findOne({})) {
      Posts.remove({})
    }
    if (Tweets.findOne({})) {
      Tweets.remove({})
    }
    if (Meteor.user().services.instagram) {
      userName = Meteor.user().services.instagram.username
      accessToken = Meteor.user().services.instagram.accessToken
    } else {
      confirm("Please login with instagram!")
    }
    // var accessToken = ''
    // var userName = ''
      // if (Meteor.user().services.facebook) {
      //   userName = Meteor.user().services.facebook.name
    if (Searches.findOne({
        text: text
      })) {
      var object = Searches.findOne({
        text: text
      })
      var count = object['count'] + 1
      console.log(object)
      Searches.update({
        _id: object['_id']
      }, {
        text: text,
        user: userName,
        count: count
      })
    } else {
      Searches.insert({
        text: text,
        user: userName,
        count: 0
      })
    }
    if (Relateds.findOne({})) {
      Relateds.remove({})
    }
    // TODO: Refactor the following three methods into one beautiful method.
    Meteor.call("getRelatedTags", text, accessToken, function(err, results) {
      console.log(results)
      for (var i = 0; i < results.length; i++) {
        Relateds.insert({
          hashtag: "#"+results[i]['name']
        });
      }
    })

    Meteor.call('getPosts', text, accessToken, function(err, result) {
      console.log(result)
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

Template.body.helpers({
  searches: function() {
    return Searches.find(
      {}, {sort: {count: -1}}
    )
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
    } else {
      confirm("Please login with instagram!")
    }
    if (Searches.findOne({
        text: text
      })) {
      var object = Searches.findOne({
        text: text
      })
      var count = object['count'] + 1
      console.log(object)
      Searches.update({
        _id: object['_id']
      }, {
        text: text,
        user: userName,
        count: count
      })
    } else {
      Searches.insert({
        text: text,
        user: userName,
        count: 0
      })
    }
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
