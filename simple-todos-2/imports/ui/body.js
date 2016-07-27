import {Template} from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './body.html';
import './task.js';

Template.body.helpers({
  tasks(){
    return Tasks.find({}, { sort: { createdAt: -1}});
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
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  }
});
