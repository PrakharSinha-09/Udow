const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  //Searching For The Email
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //If A User Doesn't exist..Obviously will create user out of the req.body
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  //Once the user is created, we will send these informations to the user along with the jwt token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed To create user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  // console.log(user)
  if(user==null){
    res.json({"error":"User Doesn't Exist"})
  }
  else if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//api/user?search=prakhar ...we will be sending the data to the backend via queries. and not by req.body otherwise we have to use post method
//just like if the url had the id, we use req.params to capture that id right! for capturing queries, we have req.query
const allUsers=asyncHandler(async(req,res)=>{
  const keyword = req.query.search
  ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
  : {};

const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });             //this will ensure that current logged in user donesn't see its name in the chatlist
res.send(users);
})

module.exports = { registerUser, authUser,allUsers };
