const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,require:true},
    pic:{type:String,
        required:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
},{
    timestamps:true
})

const User=mongoose.model("User",userSchems)
module.exports=User