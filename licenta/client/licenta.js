// TODO: -after login show all content
//       -add posibility to search by certain params.
Searches = new Mongo.Collection('searches')
  // Tweets = new Mongo.Collection('tweets')
Tweets = new Mongo.Collection(null)
  // Posts = new Mongo.Collection('posts')
Posts = new Mongo.Collection(null)
Relateds = new Mongo.Collection(null)

callStuff = function(text) {
  document.getElementById('content-results').style.display="";
  if (Posts.findOne({})) {
    Posts.remove({})
  }
  if (Tweets.findOne({})) {
    Tweets.remove({})
  }
  try {
    if (Meteor.user().services.instagram) {
      userName = Meteor.user().services.instagram.username
      accessToken = Meteor.user().services.instagram.accessToken
    }
  } catch (e) {
    $("#myModal").modal('toggle');
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
      count: 1
    })
  }
  if (Relateds.findOne({})) {
    Relateds.remove({})
  }
  // TODO: Refactor the following three methods into one beautiful method.
  Meteor.call("getRelatedTags", text, accessToken, function(err, results) {
    //var ciorba = document.getElementById("ciorba-fff");
    console.log(results)
    for (var i = 0; i < results.length; i++) {
      Relateds.insert({
        hashtag: "#" + results[i]['name']
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
  return accessToken;
}

Template.search.events({
  'click #live-search': function() {
    console.log("ciorbaaaaaaa");
    callStuff(this.text);
  }
})

Template.related.events({
  'click .label': function() {
    callStuff(this.hashtag.substr(1))
  }
})

Template.body.helpers({
  searches: function() {
    return Searches.find({}, {
      sort: {
        count: -1
      }
    })
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
    document.getElementById("related-well").style.display= "";
    event.preventDefault()
    var text = event.target.text.value;

    var accessToken = callStuff(text);
    // TODO: Refactor the following three methods into one beautiful method.
    Meteor.call("getRelatedTags", text, accessToken, function(err, results) {
      console.log(results)
      if (Relateds.findOne({})) {
        Relateds.remove({})
      }
      for (var i = 0; i < results.length; i++) {
        Relateds.insert({
          hashtag: "#" + results[i]['name']
        });
      }
    })
    event.target.text.value = ''
  },
  'click #login-instagram': function(event){
    Meteor.loginWithInstagram(function(err, res) {
      if (err !== undefined)
        console.log("ciorba este servita: " + res)
      else {
        console.log("ciorba este sleita: " + err);
      }
    })
  }
})

Template.user_loggedout.events({
  "click #login": function(e, tmpl) {
    Meteor.loginWithInstagram(function(err, res) {
      if (err !== undefined)
        console.log("ciorba este servita: " + res)
      else {
        console.log("ciorba este sleita: " + err);
      }
    })
  }
})

Template.user_loggedin.events({
  "click #logout": function(e, tmpl){
    Meteor.logout(function(err){
      if(err){
        console.log("Ciorba este sleita: "+ err);
      }
      else {
        console.log("Ciorba este servita: ");
      }
    })
  }
})
