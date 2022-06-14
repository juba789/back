// const res = require("express/lib/response")

const mongoose =require("mongoose")
const unlink=require("fs").promises.unlink


const productSchema= new mongoose.Schema({
    userId : String, 
    name : String ,
    manufacturer:  String, 
    description : String ,
    mainPepper : String ,
    imageUrl : String ,
    heat : Number ,
    likes : Number ,
    dislikes : Number ,
    usersLiked : [String] ,
    usersDisliked : [ String ]
})

const Product= mongoose.model("Product",productSchema)



function getSauces(req,res){
    // Product.deleteMany({}).then(console.log).catch(console.error)
    console.log("le token validé bienvenue dans getSauces")
    console.log("le token est bon")
    Product.find({}).then(products=>res.send(products)).catch(error=>res.status(500).send(error))
}


function getSauceById(req,res){
    const id= req.params.id 
    Product.findById(id)
       .then((product)=>res.send(product))
       .catch(error=>res.status(500).send(error))
 }

 function deleteSauce(req,res){
    const id= req.params.id 
    Product.findByIdAndDelete(id)
    .then(deleteImage)
    .then((product)=>res.send({ message: product }))
    .catch((err)=>res.status(500).send({message:err}))
 }

 function deleteImage(product){
const imageUrl =product.imageUrl
const fileToDelete =imageUrl.split("/").at(-1)
 return unlink(`images/${fileToDelete}`).then(()=>product)

 }

function createSauce(req,res){
    const body =req.body
    const file=req.file
    const fileName=file.fileName
    console.log({file})
    const sauce =JSON.parse(body.sauce)
    function makeImage(req,fileName){
        console.log("req protocol:" ,req.protocol + '://' + req.get('host')+"/images/"+fileName)
      return  req.protocol + '://' + req.get('host')+"/images/"+fileName
    }
   const {name,manufacturer,description,mainPepper,heat,userId}=sauce
    
const product= new Product({
    userId:userId,                 /*au lieu d'écrire userId=userId,je peux réduire à userId,pareil pour le reste*/
    name:name,
    manufacturer:manufacturer, 
    description:description,
    mainPepper:mainPepper ,
    imageUrl:makeImage(req,fileName) ,
    heat:heat,
    likes : 0,
    dislikes : 0 ,
    usersLiked : [] ,
    usersDisliked : []
})

product.save().then((message)=>{
    res.status(201).send({message:message});
    return console.log("produit enregistré", message)
}).catch(console.error)
}

module.exports={getSauces,createSauce,getSauceById,deleteSauce}