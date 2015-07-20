if (Meteor.isClient) {
  // counter starts at 0
  Deps.autorun(function(){
    if (Meteor.user() && Meteor.user().services){
       var token = Meteor.user().services.facebook.accessToken);

    }
  });
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
