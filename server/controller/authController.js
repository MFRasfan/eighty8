const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const {
  signupSchema,
  staffRegisterSchema,
  verifyAccountSchema,
  loginSchema,
  resetPasswordSchema,
  forgetPasswordSchema,
} = require("../shared/validationSchema/authSchema");
const User = require("../model/user");
const generateOTP = require("../shared/generateOTP");
const {sendEmail} = require("../shared/sendgrid")
const role = require("../model/role");
const { generateAccessToken,verifyAccessToken, generateRefreshToken } = require("../shared/jwt");
dotenv.config();

// Controller function for user signup
const signup = async (req, res) => {
  try {
    // Validate email, password, and role using Joi
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user already exists in MongoDB
    const user = await User.findOne({ email: value.email });
    if (user) {
      return res.status(409).json({error: "User already exists" });
    }

    // Encrypt password using bcrypt
    const hashedPassword = await bcrypt.hash(value.password, 10);

    // Generate random OTP
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry time
    const code = generateOTP();
    // user.emailToken.code = code;
    // user.emailToken.expiresAt = expiresAt;
    let otp={
      code:code,
      expiresAt:expiresAt
    }
    console.log(user)

    // Send email to user with OTP using SendGrid
    const msg = {
      email: value.email,
      subject: "Verify your email address",
      code: code
    };
    await sendEmail(msg)

    //find if role exist in database with permissions and status
    const RoleExist = await role.findOne({ role: value.role });
    console.log(RoleExist, value.role)
    // Create new user in MongoDB using Mongoose
    const newUser = new User({
      email: value.email,
      password: hashedPassword,
      role: RoleExist._id,
      emailToken: otp,
    });


    await newUser.save();
    // Send success response
    res.status(201).json({ message: "A verification email has been sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function for user signup
const registerStaff = async (req, res) => {
  try {
    // Validate email, password, and role using Joi
    const { error, value } = staffRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists in MongoDB
    const user = await User.findOne({ email: value.email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

   
    
    // Generate random OTP
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry time
    const code = generateOTP();

    let otp={
      code:code,
      expiresAt:expiresAt
    }

    // Send email to user with OTP using SendGrid
    // sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      email: value.email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Welcome to Eighty Eight Alpha Autos Team",
      text: `Your team account has been created , please login using the following credentials, email:${value.email} password:${value.password}`,
      html: `
      <div>
        <p>Your team account has been created , please login using the following credentials and don't forget to update your credentials for better security</p>
        </br>
        <p>Email: ${value.email}</p>
        <p>Password: ${value.password}</p>
      </div>
      `,
    };
    // await sendgrid.send(msg);
    await sendEmail(msg)

    // Encrypt password using bcrypt
    const hashedPassword = await bcrypt.hash(value.password, 10);
   
    // Create new user in MongoDB using Mongoose

    const newUser = new User({...value});
    newUser.emailToken = otp
    newUser.password = hashedPassword
    newUser.isEmailVerified=true

    console.log(newUser, hashedPassword)

    const savedUser = await newUser.save();
    // Send success response
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const verifyAccount = async (req, res) => {
  try {
    const { value, error } = await verifyAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {emailToken} = await User.findOne({email:value.email}).select('emailToken')
    if(emailToken!==null && emailToken.code=== value.code){
      const verifiedUser = await User.findOneAndUpdate(
            { email: value.email },
            {
              emailToken: null,
              isEmailVerified: true,
            },
            { new: true }
          );

          res.json({
            message:"account updated successfully"
          })
    }else{
      res.status(400).json({error:"invalid otp"})
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });  
  }
};



const login = async(req, res) => {
 try {
    const {value, error}= loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({email:value.email}).populate('role')
    if(!user){
     return  res.status(401).json({error:"Invalid email or password"})
    }

    const validPassword= await bcrypt.compare(value.password,user.password)
    if(!validPassword){
      return res.status(401).json({error:"Invalid email or password"})
    }

    const accessToken = await generateAccessToken(user)
    const refreshToken= await generateRefreshToken(user)

    user.refreshToken= refreshToken
    await user.save()

    let obj = Object.assign({},user._doc)
    console.log(user)
    delete obj.password
    delete obj.emailToken
    res.json({
      accessToken,
      refreshToken,
      user:obj
    })

 } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
 }
};

const refreshAccessToken = async(req,res)=>{
  const {refreshToken}= req.body;
  
  if(!refreshToken){
    return res.status(401).json({message:'no access token provide'})
  }

  try {
    
    const decoded = await verifyAccessToken(refreshToken)
    const user= await User.findById(decoded.userId);
    
    if(!user|| user.refreshAccessToken !== refreshToken){
      return res.status(401).json({message:'Invalid refresh token'})
    }
    const accessToken = generateAccessToken(user._id)
    res.status(200).json({accessToken})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

}

const forgetPassword = async(req, res) => {

  try {
    const {error,value}= forgetPasswordSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // Check if the user exists in the database
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const code = await generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry time
    user.emailToken.code = code;
    user.emailToken.expiresAt = expiresAt;
    await user.save();

    try {
      const msg = {
        email: value.email,
        subject: "Reset Password Email",
        code: code
      };
      await sendEmail(msg)
  
      res.status(200).json({message:'OTP code sent to email'});
    } catch (error) {
      console.error(error);
      res.status(500).json({error:'Error sending email'});
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal server error' });
  }

};

const confirmForgetPasswordOtp = async (req, res) => {
  try {
    const { value, error } = await verifyAccountSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {emailToken} = await User.findOne({email:value.email}).select('emailToken')
    if(emailToken!==null && emailToken.code=== value.code){
          res.json({
            success:true
          })
    }else{
      res.status(400).json({error:"invalid otp"})
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });  
  }
};

const resetPassword = async(req, res) => {
  try {
    const {error, value}= await resetPasswordSchema.validate(req.body)
    
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
   
    const user = await User.findOne({ email: value.email });
   
    if (!user) {
      return res.status(404).json({error:'User not found'});
    }
    console.log("user.emailToken.code !== value.code",user.emailToken.code !== value.code,user ,value.code)
    // if (user.emailToken.code !== value.code) {
    //   return res.status(400).json({error:'Invalid OTP code'});
    // }
    // if (user.emailToken.expiresAt < Date.now()) {
    //   return res.status(400).json({error:'OTP code has expired'});
    // }
    user.password = await bcrypt.hash(value.password, 10);
    user.emailToken.code = null;
    user.emailToken.expiresAt = null;
    await user.save();
    res.status(200).json({message:'Password updated successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  verifyAccount,
  confirmForgetPasswordOtp,
  login,
  forgetPassword,
  resetPassword,
  registerStaff,
  refreshAccessToken
};
