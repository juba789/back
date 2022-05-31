//Database
const mongoose = require('mongoose');
const password="azeqsdwxc"
const uri =`mongodb+srv://juba:${password}@cluster0.dd0gg.mongodb.net/?retryWrites=true&w=majority`

mongoose
  .connect(uri)
  .then(()=>console.log("connecté à mongo"))
  .catch((err)=>console.error("erreur de connection:",err))

const userSchema= new mongoose.Schema({
 email:String,
 password:String
})

const User= mongoose.model("User",userSchema)

module.exports={mongoose,User}