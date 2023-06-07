const express=require('express')
const dotenv=require('dotenv')
const chats = require('./data/data')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes=require('./routes/userRoutes')

// dotenv.config({path:+'/.env'}) 
connectDB()
const app=express()

app.use(express.json())              //so, that we can accept the data from the front end
app.get("/",(req,res)=>{
    res.send("API is running!")
}) 

app.use('/api/user',userRoutes)

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000
app.listen(PORT,console.log(`Server Started On PORT ${PORT}`))