const {User} =require("../mongo")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function createUser(req,res){
    const {email,password}=req.body
    
    const hashedPassword= await hashpassword(password)
    
    const user =new User({email,password: hashedPassword})
  user
     .save()
     .then(()=>res.send({ message: "utilisateur enregistré" }))  
     .catch((err)=>res.status(409).send({message:"utilisateur non enregistré"+err}))
  }


function hashpassword(password){
   const saltRounds = 10
   return bcrypt.hash(password,saltRounds)
  }

async function loginUser(req,res){
 try{    
const email =req.body.email
const password=req.body.password
const user = await User.findOne({email:email})
const isPasswordOk = await bcrypt.compare(password,user.password)

if (!isPasswordOk){
  res.status(403).send({message:"mot de passe incorrecte"})
}
  
const token =creatToken(email)
res.status(200).send({userId: user._id,token:token})
}catch(err){
  console.error(err)
  res.status(500).send({message:"Erreur interne"})
}

 } 

function creatToken(email){
const jwtPassword =process.env.JWT_PASSWORD
const token =jwt.sign({email:email},jwtPassword,{expiresIn:"24h"})

return token

}

  module.exports={createUser,loginUser}