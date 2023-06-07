const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect("mongodb+srv://prakharsinha2k2:O0dr1Bw5PntHDaLE@cluster0.hv5lb1h.mongodb.net/?retryWrites=trueO0dr1Bw5PntHDaLE",{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    }
    catch(error){
        console.log(`Error :${error.message}`)
        process.exit()
    } 
}

module.exports=connectDB