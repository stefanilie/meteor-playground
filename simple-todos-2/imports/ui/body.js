import {Template} from 'meteor/templating';

import './body.html';

Template.body.helpers({
  tasks: [
    { text: 'this is task 1' },
    { text: 'this is task 2' },
    { text: 'this is task 3' }
  ],
});
