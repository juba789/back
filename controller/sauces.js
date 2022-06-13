// const res = require("express/lib/response")

const mongoose =require("mongoose")


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
    Product.find({}).then(products=>res.send(products))
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

module.exports={getSauces,createSauce}