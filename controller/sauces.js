const mongoose = require("mongoose")
const { unlink } = require("fs/promises")


const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: { type: Number, min: 1, max: 5 },
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String]
})
const Product = mongoose.model("Product", productSchema)

function retrieveSauces(req, res) {
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error))
}

function retrieveSauce(req, res) {
  const { id } = req.params
  return Product.findById(id)
}

function retrieveSauceById(req, res) {
  retrieveSauce(req, res)
    .then((product) => sendCliResponse(product, res))
    .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
  const { id } = req.params
  Product.findByIdAndDelete(id)
    .then((product) => sendCliResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => res.status(500).send({ message: err }))
}

function modifySauce(req, res) {
  const {
    params: { id }
  } = req

  const hasNewImage = req.file != null
  const payload = makePayload(hasNewImage, req)

  Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendCliResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => console.error("PROBLEM UPDATING", err))
}

function deleteImage(product) {
  if (product == null) return
  console.log("DELETE IMAGE", product)
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/" + imageToDelete)
}

function makePayload(hasNewImage, req) {
  console.log("hasNewImage:", hasNewImage)
  if (!hasNewImage) return req.body
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  console.log("NOUVELLE IMAGE A GERER")
  console.log("voici le payload:", payload)
  return payload
}

function sendCliResponse(product, res) {
  if (product == null) {
    console.log("NOTHING TO UPDATE")
    return res.status(404).send({ message: "Object not found in database" })
  }
  console.log("ALL GOOD, UPDATING:", product)
  return Promise.resolve(res.status(200).send(product)).then(() => product)
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}
function createSauce(req, res) {
  const { body, file } = req
  const { fileName } = file
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce

  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
   product
    .save()
    .then((message) => res.status(201).send({ message }))
    .catch((err) => res.status(500).send(err))
}

function likeSauce(req,res){
  const like=req.body.like
  const userId=req.body.userId
  if(![-1,0,1].includes(like)) return res.status(403).send({message:"like invalid"})

  retrieveSauce(req,res)
   .then((product)=>addVote(product,like,userId,res) )
   .then((pr) => pr.save())
   .then(article=>sendCliResponse(article,res))
   .catch((err)=>res.status(500).send(console.log(err)))
  }

  
  function addVote(product,like,userId,res){
    if(like===1 || like===-1)  return addlike(product,userId,like)
    return resetLike(product,userId,res)
   
  
}

function resetLike(product,userId,res){
  const usersLiked=product.usersLiked
  const usersDisliked=product.usersDisliked

  if ([usersLiked,usersDisliked].every(arr=>arr.includes(userId))) 
  return Promise.reject("user voted both ways")

  if ( ! [usersLiked,usersDisliked].some(arr=>arr.includes(userId))) 
  return Promise.reject("user has not yet voted")

  
  


 if(usersLiked.includes(userId)){
  --product.likes
product.usersLiked=product.usersLiked.filter(id=>id!==userId)
 }
 else{
  --product.dislikes
  product.usersDisliked=product.usersDisliked.filter(id=>id!==userId)
 }
  

  return product
}


function addlike(product,userId,like) {
const usersLiked=product.usersLiked
const usersDisliked=product.usersDisliked
const votersArray=like===1?  usersLiked:usersDisliked
if(votersArray.includes(userId)) return product
votersArray.push(userId)   

like===1?++product.likes:++product.dislikes



return product

}



module.exports = {likeSauce,sendCliResponse,retrieveSauce,retrieveSauces, createSauce,retrieveSauceById, deleteSauce, modifySauce }