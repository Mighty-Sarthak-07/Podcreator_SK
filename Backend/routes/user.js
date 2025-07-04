const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (username.length < 5) {
      return res.status(400).json({ message: "Username must have at least 5 characters" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must have at least 6 characters" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingEmail || existingUsername) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save();
    return res.status(200).json({ message: "Account Created" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});



router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("podcasterUserToken", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    return res.status(200).json({
      id: existingUser._id,
      username: existingUser.username,
      email,
      message: "Sign-in Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/logout", async(req,res)=>{
  res.clearCookie("podcasterUserToken",{
    httpOnly:true,
  });
  res.json({message:"Logged Out"});
});

router.get("/check-cookie",(req,res)=>{
  const token = req.cookies.podcasterUserToken;
  if(token){
  return res.status(400).json({ message: true });
  }
  return res.status(400).json({ message: false});
});

router.get("/user-details",authMiddleware,async(req,res)=>{
  try {
    const {email} = req.user;
    const existingUser = await User.findOne({email: email}).select("-password");
    return res.status(200).json({user: existingUser});

  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
})


module.exports = router;
