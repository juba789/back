require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser= require("body-parser")
const jsonParser=bodyParser.json()
const port = 3000

console.log("variable d'environnement:",process.env.MOTDEPASSE)

//Connection à la Database
require("./mongo")

//Controllers
const {createUser,logUser} =require("./controller/user")
const {getSauces,createSauce}= require("./controller/sauces")


//Middelware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const {authenticateUser}=require("./middleware/auth")


//Route
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login",logUser)
app.get("/api/sauces",authenticateUser, getSauces)
app.post("/api/sauces",authenticateUser,jsonParser, createSauce)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Ecoute du port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

