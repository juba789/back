const express = require("express")
const sauceRouter=express.Router()
const {retrieveSauces,createSauce,retrieveSauceById,deleteSauce,modifySauce,likeSauce}= require("../controller/sauces")

const {authenticateUser}=require("../middleware/auth")
const {upload}=require("../middleware/multer")

sauceRouter.get("/",authenticateUser, retrieveSauces)
sauceRouter.post("/",authenticateUser,upload.single("image"), createSauce)
sauceRouter.get("/:id",authenticateUser,retrieveSauceById)
sauceRouter.delete("/:id",authenticateUser,deleteSauce)
sauceRouter.put("/:id",authenticateUser, upload.single("image"), modifySauce)
sauceRouter.post("/:id/like",authenticateUser)
sauceRouter.post("/:id/like",authenticateUser, likeSauce)
module.exports = {sauceRouter}
