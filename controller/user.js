const {User} =require("../mongo")

function createUser(req,res){
    const {email,password}=req.body
    const user =new User({email,password})
  user
     .save()
     .then(()=>res.send({ message: "utilisateur enregistré" }))  
     .catch((err)=>console.log("user non enregistré",err))
  }

  module.exports={createUser}