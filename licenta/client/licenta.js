// TODO: -add posibility to search by certain params.
Searches = new Mongo.Collection('searches')
  // Tweets = new Mongo.Collection('tweets')
Tweets = new Mongo.Collection(null)
  // Posts = new Mongo.Collection('posts')
Posts = new Mongo.Collection(null)
Relateds = new Mongo.Collection(null)

callStuff = function(text) {
  if (text != "") {
    try {
      if (Meteor.user().services.instagram) {
        userName = Meteor.user().services.instagram.username
        accessToken = Meteor.user().services.instagram.accessToken
      }
    } catch (e) {
      $("#myModal").modal('toggle');
      return;
    }
    document.getElementsByClassName("sk-folding-cube")[0].style.display = "";
    document.getElementsByClassName("sk-folding-cube")[1].style.display = "";

    document.getElementsByClassName("row")[0].style.webkitTransform = "translate(0, -25em)";
    document.getElementsByClassName("main")[0].style.webkitTransform = "translate(0, -25em)";
    document.getElementById("related-well").style.display = "";
    document.getElementById('content-results').style.display = "";
    if (Posts.findOne({})) {
      Posts.remove({})
    }
    if (Tweets.findOne({})) {
      Tweets.remove({})
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
      try {
        console.log(results)
        for (var i = 0; i < results.length; i++) {
          Relateds.insert({
            hashtag: "#" + results[i]['name']
          });
        }
      } catch (e) {
        
      }
    })

    Meteor.call('getPosts', text, accessToken, function(err, result) {
      console.log(result)
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          Posts.insert({
              query: text,
              html: result[i]
            })
            // arrayOfLinks.push(arrEmbeded[i]['html'])
        }
        document.getElementsByClassName("sk-folding-cube")[1].style.display = "none";
      } else {
        document.getElementById("posts-results").innerHTML = "Sorry, but no instagram posts found containing " + text
        document.getElementsByClassName("sk-folding-cube")[1].style.display = "none";

      }
    })

    Meteor.call('tweeterSearch', text, function(err, results) {
      if (!err) {
        if (results.length > 0) {
          // console.log(results)
          for (var i = 0; i < results.length; i++) {
            console.log(results[i])
            Tweets.insert({
              html: results[i]
            })
          }
          document.getElementsByClassName("sk-folding-cube")[0].style.display = "none";
        } else {
          document.getElementById("tweets-results").innerHTML = "Sorry, but no tweets found containing " + text;
          document.getElementsByClassName("sk-folding-cube")[0].style.display = "none";

        }
      }
    })

    event.target.text.value = ''

    return accessToken;
  } else {
    $("#modalTerm").modal('toggle');
  }
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
    event.preventDefault()
    var text = event.target.text.value;

    var accessToken = callStuff(text);
    // TODO: Refactor the following three methods into one beautiful method.
    if (accessToken != null) {
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
    }
  },
  'click #login-instagram': function(event) {
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
  "click #logout": function(e, tmpl) {
    Meteor.logout(function(err) {
      if (err) {
        console.log("Ciorba este sleita: " + err);
      } else {
        console.log("Ciorba este servita: ");
        document.getElementsByClassName("sk-folding-cube")[0].style.display = "none";
        document.getElementsByClassName("sk-folding-cube")[1].style.display = "none";

        document.getElementsByClassName("row")[0].style.webkitTransform = "translate(0, 0em)";
        document.getElementsByClassName("main")[0].style.display = "none";
        document.getElementById("related-well").style.display = "none";
        document.getElementById('content-results').style.display = "none";
      }
    })
  }
})
