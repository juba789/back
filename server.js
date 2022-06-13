require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

//Middelware
app.use(cors())
app.use(express.json())

module.exports={app,express}