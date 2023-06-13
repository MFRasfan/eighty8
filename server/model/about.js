const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  section1: {
    title: String,
    image: String,
    description: String
  },
  section2: [{
    title: String,
    description: String,
    image: String,
  }],
  section3:[{
    title: String,
    description: String
  }]
});

const About = mongoose.model('About', AboutSchema);

module.exports = About;
