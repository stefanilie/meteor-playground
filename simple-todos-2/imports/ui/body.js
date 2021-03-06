import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './body.html';
import './task.js';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks(){
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')){

      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true} }, {sort: {createdAt: -1}});
    }
    return Tasks.find({}, { sort: { createdAt: -1}});
  },
  incompleteCount() {
    count = Tasks.find({ checked: {$ne: true} }).count();
    if(count>0)
      return count;
    else
      return "Complete"
  }
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser from submit
    event.preventDefault();

    console.log(event);

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked);
  }
});
