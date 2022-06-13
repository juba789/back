require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
// const bodyParser= require("body-parser")
const path =require("path")
const multer=require("multer")
// const upload =multer({dest:"/images"})
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    
    
    cb(null,makeFileName(req,file))
  }
})
function makeFileName(req,file){
  const fileName =`${Date.now()}-${file.originalname}`.replace(/\s/g,"-")
  file.fileName=fileName
  return fileName


}
const upload = multer({ storage: storage })

const port = 3000



//Connection à la Database
require("./mongo")

//Controllers
const {createUser,logUser} =require("./controller/user")
const {getSauces,createSauce}= require("./controller/sauces")


//Middelware
app.use(cors())
app.use(express.json())

// app.use(bodyParser.json())

// app.use(bodyParser.urlencoded({extended:true}))
const {authenticateUser}=require("./middleware/auth")

// const upload =multer({dest:"images/"}).single("image")
// const storage =multer.diskStorage({destination:"images/",filename:makeFilename})
// const upload=multer({ storage: storage })

// function makeFilename(req, file, cb) {
  
  // cb(null,Date.now() + '-' + file.originalname )
// }




//Route
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login",logUser)
app.get("/api/sauces",authenticateUser, getSauces)
app.post("/api/sauces",authenticateUser,upload.single("image"), createSauce)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Ecoute du port
app.use("/images",express.static(path.join(__dirname,"images")))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

