//this schema will be having 3 things:
//first, the name of the sneder or the id of the sender.
//second is the content of the message, i.e., what is written inside of this image
//and third will be the refennce of the chats, to which it belong to

const mongoose=require('mongoose')

const messageSchema=mongoose.Schema({
    sender:{type: mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String,trim:true},
    chat:{type: mongoose.Schema.Types.ObjectId,ref:"Chat"}
},{
    timestamps:true
})

const Message=mongoose.model("Message",messageSchema)

module.exports=Message
