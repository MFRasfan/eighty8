const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  // roleId: [{
  //   id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Role',
  //     required: true
  //   },
  //   read: {
  //     type: Boolean,
  //     default: false
  //   }
  // }],
  user: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  }]
},{timestamps:true});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
