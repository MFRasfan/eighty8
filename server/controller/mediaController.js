const multer = require('multer');
// const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Set up multer storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  // Set up multer upload middleware
  const upload = multer({ storage: storage });
  
  // Set up POST endpoint for image upload
  const uploadImage = async (req, res, next)=> {
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload an image');
      error.status = 400;
      return next(error);
    }
  
    try {
      // Read the image file
      // const inputBuffer = await sharp(file.path).toBuffer();
  
      // Optimize the image
      // const outputBuffer = await sharp(inputBuffer)
      //   .resize({ width: 800, height: 800, fit: sharp.fit.inside })
      //   .jpeg({ quality: 80 })
      //   .toBuffer();
  
      // Write the optimized image to disk
      // await sharp(outputBuffer).toFile(`uploads/optimized-${file.filename}`);
  
      // Send a success response
      res.json({
        // message:'Image uploaded and optimized successfully',
        url:`${file.filename}`

    });
    } catch (err) {
      next(err);
    }
  }


  const deleteImage = async  (req, res) => {
    const filename = req.query.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
  
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error(error);
        res.status(500).json({error:'Error deleting file'});
      } else {
        res.status(200).json({message:'File deleted successfully'});
      }
    });
  }
  module.exports={ uploadImage, upload, deleteImage}