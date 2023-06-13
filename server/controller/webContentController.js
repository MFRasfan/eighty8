const FAQ = require('../model/faq');
const Home = require('../model/home');
const About = require("../model/about");
const Contact = require('../model/contact');


// Create a new home entry
const createHome = async (req, res) => {
  try {
    
    console.log("req.body",req.body)
    const findHome= await Home.find({})
    console.log(findHome)
    if(findHome.length<1){
      const home = new Home(req.body);
  
      await home.save();
      return res.status(201).json({ message: 'Home entry created successfully', data: home });
    }else{
      let id = findHome[0]._id
      console.log("req.body----------",req.body)
      Home.findByIdAndUpdate({_id:id}, req.body, {new:true} )
      .exec((err, doc)=>{
        if(err){
          return res.json({error:"Database Error", reason:err.message})
        }
        if(doc){
          console.log("doc", doc)
          return res.json({message:"home content updated successfully"})
        }
      })
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all home entries
const getHomes = async (req, res) => {
  try {
    const homes = await Home.find();
    res.status(200).json(homes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Create a new contect entry
const createContact = async (req, res) => {
  try {
    
    const findContact =await Contact.find({})
    console.log(findContact)
    if(findContact.length<1){
      const contact = new Contact(req.body);
  
      await contact.save();
      return res.status(201).json({ message: 'Contact entry created successfully', data: contact });
    }else{
      let id = findContact[0]._id
      Contact.findByIdAndUpdate({_id:id}, req.body, {new:true} )
      .exec((err, doc)=>{
        if(err){
          return res.json({error:"Database Error", reason:err.message})
        }
        if(doc){
          return res.json({message:"Contact content updated successfully"})
        }
      })
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all home entries
const getContact = async (req, res) => {
  try {
    const contact = await Contact.find();
    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Create a new contect entry
const createAbout = async (req, res) => {
  try {
    
    const findAbout= await About.find({})
    console.log(findAbout)
    if(findAbout.length<1){
      const about = new About(req.body);
      await about.save();
      return res.status(201).json({ message: 'About entry created successfully', data: about});
    }else{
      let id = findAbout[0]._id
      About.findByIdAndUpdate({_id:id}, req.body, {new:true} )
      .exec((err, doc)=>{
        if(err){
          return res.json({error:"Database Error", reason:err.message})
        }
        if(doc){
          return res.json({message:"About content updated successfully"})
        }
      })
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all home entries
const getAbout = async (req, res) => {
  try {
    const about = await About.find();
    res.status(200).json(about);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Create a new contect entry
const createFAQ = async (req, res) => {
  try {
    
      const faq = new FAQ(req.body);
      await faq.save();
      return res.status(201).json({ message: 'FAQ entry created successfully', data: faq });
  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updataFAQ=async(req,res)=>{
  try {
    if(!req.query.id){
      return res.json({error:"Id not found"})
    }
    let id = req.query.id
    FAQ.findByIdAndUpdate({_id:id}, req.body, {new:true} )
    .exec((err, doc)=>{
      if(err){
        return res.json({error:"Database Error", reason:err.message})
      }
      if(doc){
        return res.json({message:"FAQ content updated successfully"})
      }
    })
  } catch (error) {
    
  }

}

// Get all home entries
const getFAQ = async (req, res) => {
  try {
    const homes = await FAQ.find();
    res.status(200).json(homes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports={ 
    createHome,
    getHomes,
    getFAQ,
    updataFAQ,
    createFAQ,
    createAbout,
    getAbout,
    getContact,
    createContact
  
}