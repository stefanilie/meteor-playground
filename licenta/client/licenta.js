Searches = new Mongo.Collection('searches')
Deps.autorun(function () {
  if (Meteor.user() && Meteor.user().services) {
    // var token = Meteor.user().services.facebook.accessToken
  }
})
Meteor.loginWithInstagram(function (err, res) {
  if (err !== undefined)
    console.log('sucess ' + res)
  else
    console.log('login failed ' + err)
})
Template.body.helpers({
  searches: function () {
    return Searches.find()
  }
})

Template.body.events({
  'submit .searched': function (event) {
    event.preventDefault()

    var text = event.target.text.value
    var accessToken = ''
    var userName = ''
    if (Meteor.user().services.facebook) {
      userName = Meteor.user().services.facebook.name
    } else {
      userName = Meteor.user().services.instagram.username
      accessToken = Meteor.user().services.instagram.accessToken
    }

    Searches.insert({
      text: text,
      user: userName,
      createdAt: new Date()
    })

    // Meteor.call("getRelatedTags", text, accessToken, function(err, results) {
    //    console.log(JSON.parse(results.content)['data'])
    // })
    Meteor.call('getPosts', text, accessToken, function (err, results) {
      var response = JSON.parse(results.content)['data']
      //console.log(response)
      // var baseUrl = "https://instagr.am/p/"
      var arrayOfLinks = []
      // var arrayOfEmbed = []
      for (var i = 0; i < response.length; i++) {
        var toAdd = response[i]['link']
        var start = toAdd.length - 11
        toAdd = toAdd.slice(start)
        toAdd = toAdd.substring(0, toAdd.length - 1)
        arrayOfLinks.push(toAdd)
      }
      // TODO: merge in one bit for
      Meteor.call('getEmbed', arrayOfLinks, function (err, result) {
        //console.log(embededPosts)
        arrayOfLinks = [];
        for (var i = 0; i < result.length; i++) {
          arrayOfLinks.push(result[i]['html']);
        }
      })
      console.log(arrayOfLinks)
    })

    event.target.text.value = ''
  }
})
