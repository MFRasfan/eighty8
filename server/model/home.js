const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  section1_banner: {
    title: String,
    description:{
      type:String,
      default:""
    },
    image: String,
  
  },
  section2: [{
    title: String,
    image: String,
    description: String
  }],
  section3: {
    title: {
      type:String,
      default:""
    },
    description:{
      type:String,
      default:""
    },
    image: String,
  },
  section4: {
    title: String,
    video: String
  },
  section5: {
    title: String,
    image: [String]
  }
});

const Home = mongoose.model('Home', HomeSchema);

module.exports = Home;
