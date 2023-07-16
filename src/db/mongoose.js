const mongoose = require('mongoose')

mongoose.connect(process.env.mongod_url)
.then((mongoose)=>{
    console.log("Successfully connected to databse");
})
.catch((err)=>{
    console.log("Can not connect to data base")
});