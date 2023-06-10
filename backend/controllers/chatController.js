const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const accessChat=asyncHandler(async(req,res)=>{
        const { userId } = req.body;

        if (!userId) {
            console.log("UserId param not sent with request");
            return res.sendStatus(400);
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate("users", "-password")                          //if the chat exist obviously then we are storing those users in users array.
            .populate("latestMessage");                              //Similarly, populating the message

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        //if chat exists...then we gonna send it
        if (isChat.length > 0) {
            res.send(isChat[0]);
          }     

          //otherwise create the new chat bew the user and the other one, that's why in the users: section, two things are passed that is the currently logged in user and the id of the other user to which we are trying to create the chat
        else {
            var chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user._id, userId],             
            };
        
            //Now we will be storing this created chat inside the database
            try {
              const createdChat = await Chat.create(chatData);
              const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
              );
              res.status(200).json(FullChat);
            } 
            catch (error) {
              res.status(400);
              throw new Error(error.message);
            }
        }
})

const fetchChat=asyncHandler(async(req,res)=>{
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })               //we simply have to search this up on the users array
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })                                             //chats will be arranged as per the updates
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
})

//for creating group chats, we are gonna take a bunch of users from the body and we are gonna take the name of group chat and that's all
const createGroupChat=asyncHandler(async(req,res)=>{

    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
    
      var users = JSON.parse(req.body.users);                       //front end we will send that data in stringify
     
      if (users.length < 2) {                                      //if the number of users are less than 2, then group won't get created
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }
    
      users.push(req.user);                                         //this means the one who is creating the group will also be the part of the group....Obviously!
    
      try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user,                                     //obviously the admin will be the user who has logged in
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body

    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,
        {chatName},
        {
            new:true                //don't forget new:true this will ensure that you get update value after updating
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
})

const addToGroup = asyncHandler(async (req, res) => {
    //need chatId, to which user will be added to. and the userId of the partiicular user, which we are going to add to particular chat
    const { chatId, userId } = req.body;  
  
    // check if the requester is admin
  
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { 
        $push: { users: userId },                                     //we have to push that in the users array right
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  });

  const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },                         //the only difference
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}
