

const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

//Connection à la Database
require("./mongo")

//Controllers
const createUser =require("./controller/user")





//Middelware
app.use(cors())
app.use(express.json())



//Route
app.post("/api/auth/signup", createUser)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Ecoute du port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

