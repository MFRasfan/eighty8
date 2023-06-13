const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  topic:{
    type:String,
    required:true
  },
  qA: [{
    question:String,
    description: String
  }],
});

const FAQ = mongoose.model('FAQ', FAQSchema);

module.exports = FAQ;
