// Function to generate 6 digit random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  
module.exports= generateOTP