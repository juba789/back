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
    console.log("le token validé bienvenue dans getSauces")
    console.log("le token est bon")
    Product.find({}).then(products=>res.send(products))
    // res.send({message:[{sauce:"sauce1" },{sauce:"sauce2"}]})


}

function createSauce(req,res){
const product= new Product({
    userId : "bim", 
    name : "bim" ,
    manufacturer:  "bim", 
    description : "bim" ,
    mainPepper : "bim" ,
    imageUrl : "bim" ,
    heat : 2 ,
    likes : 2 ,
    dislikes : 2 ,
    usersLiked : [ "bim" ] ,
    usersDisliked : [ "bim" ]
})

product.save().then((res)=>console.log("produit enregistré",res)).catch(console.error)
}

module.exports={getSauces,createSauce}