const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  section1: {
    title: String,
    image: String,
    description: String
  },
  phonePrimary:{
    type:String,
    default:""
  } ,
  phoneSecondary:{
    type:String,
    default:""
  } ,
  emailPrimary:{
    type:String,
    default:""
  } ,
  emailSecondary:{
    type:String,
    default:""
  } ,
  weekdaysOpenTime:{
    type:String,
    default:""
  } ,
  weekdaysCloseTime:{
    type:String,
    default:""
  } ,
  weekendOpenTime:{
    type:String,
    default:""
  } ,
  weekendCloseTime:{
    type:String,
    default:""
  } ,
  addressTitlePrimary:{
    type:String,
    default:""
  } ,
  addressDetailsPrimary:{
    type:String,
    default:""
  } ,
  addressTitleSecondary:{
    type:String,
    default:""
  } ,
  addressDetailsSecondary:{
    type:String,
    default:""
  } ,
  fb:{
    type:String,
    default:""
  } ,
  linkedIn:{
    type:String,
    default:""
  } ,
  instagram:{
    type:String,
    default:""
  } ,
  twitter:{
    type:String,
    default:""
  } ,
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
