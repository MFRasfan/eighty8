
const express = require("express");
const route = express.Router();

const {
   upload,
   uploadImage,
   deleteImage
} = require('../controller/mediaController')


// route.post("/upload").post(upload.single('image'), uploadImage)
// route.post('/uploads', upload.single('file'), uploadImage)
route.post('/uploads', upload.single('file'), uploadImage)
route.delete('/delete/', deleteImage )


module.exports= route