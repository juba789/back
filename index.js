const {app,express}=require("./server")
const {sauceRouter}=require("./routers/sauces.router")
const { authRouter } = require("./routers/auth.router")
const path =require("path")
const bodyParser = require("body-parser")
const port = 3000

//Connection à la Database
require("./mongo")

//Controllers



//middleware
app.use("/api/sauces",sauceRouter)
app.use("/api/auth",authRouter)
app.use(bodyParser.json())
//Route


app.get('/', (req, res) => {
res.send('Hello World!')
})

//Ecoute du port
app.use("/images",express.static(path.join(__dirname,"images")))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

