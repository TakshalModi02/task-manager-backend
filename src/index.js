const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const sendMail = require("./email/email_config");

const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

mongoose.connect(process.env.mongod_url)
.then((mongoose)=>{
    console.log("Successfully connected to databse");
    app.listen(port, ()=>{
        console.log("Server is up on port " + port)
    })
})
.catch((err)=>{
    console.log("Can not connect to data base")
});


console.log(sendMail)