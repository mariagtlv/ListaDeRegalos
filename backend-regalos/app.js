const express = require('express')
const cors = require("cors")
const jwt = require("jsonwebtoken")
const activeApiKeys = require("./activeApiKeys")
const port = 4006
let app = express()
app.use(cors())
app.use(express.json())

const routerUsers = require("./routers/routerUsers") 
const routerPresents = require("./routers/routerPresents")
const routerFriends = require("./routers/routerFriends")

app.use(["/presents","/friends"],(req,res,next)=>{
    console.log("Middleware execution")

    let apiKey = req.query.apiKey

    if(apiKey==undefined)
        return res.status(401).json({error:"no apiKey"})
    let infoApiKey=null
    try{
        infoApiKey=jwt.verify(apiKey,"secret")
    }catch(e){
        return res.status(401).json({error:"invalid apiKey"})
    }
    

    if(infoApiKey==undefined||activeApiKeys.indexOf(apiKey)==-1)
        return res.status(401).json({error:"invalid apiKey"})

    req.infoApiKey=infoApiKey
    next()
})

app.use("/users",routerUsers)
app.use("/presents",routerPresents)
app.use("/friends",routerFriends)

app.listen(port, ()=>{
    console.log("Listening in port "+port)
})