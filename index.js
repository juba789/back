const {app,express}=require("./server")
const path =require("path")
const port = 3000

//Connection à la Database
require("./mongo")

//Controllers
const {createUser,logUser} =require("./controller/user")
const {getSauces,createSauce}= require("./controller/sauces")

//middleware
const {upload}=require("./middleware/multer")
const {authenticateUser}=require("./middleware/auth")

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

