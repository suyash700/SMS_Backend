const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true } // e.g., 'festival', 'public', 'workshop'
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
