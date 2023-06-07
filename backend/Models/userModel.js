const mongoose=require('mongoose')
const bcrypt = require("bcryptjs");

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,require:true},
    pic:{type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
},{
    timestamps:true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  

//Line 16 means that before saving, we are going to exeute a function, which will take next, as it is going to be a middleware
userSchema.pre('save',async function (next){
    if(!this.isModified){                                       //if current pwd is not modified, move onto the next.
        next()
    }

    //So, now before saving password inside the databse, it will first encrypt the password
    const salt = await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password, salt);
})

const User=mongoose.model("User",userSchema)
module.exports=User