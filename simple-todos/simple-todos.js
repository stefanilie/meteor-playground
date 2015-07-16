// simple-todos.js
Tasks = new Mongo.Collection("tasks");
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function(){
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-task": function (event){
      event.preventDefault();

      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date()
      });

      event.target.text.value = "";
    }
  });

  Template.task.events({
    "click .toggle-checked": function() {

      //this updates the item foud at _id.
      //every document has it's id
      Tasks.update(this._id, {
        //.update has 2 params: first to identify a subset and
        //the second to secify what should be done to thos docs.
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function() {
      Tasks.remove(this._id);
    }
  });
}
