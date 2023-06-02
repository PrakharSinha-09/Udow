const mongoose=require('mongoose')

const chatSchema=mongoose.Schema(
    {
        chatName:{type:String,trim:true},
        isGroupChat:{type:Boolean,default:false},
        user:[{
            type:mongoose.Schema.Types.ObjectId,                  //this will contain id to that particular user
            ref: "User"                                           //reference for the User model
        }],

        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        },

        groupAdmin: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

const Chat=mongoose.Mongoose.model("Chat",chatSchema)

module.exports=Chat