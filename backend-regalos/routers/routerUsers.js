const express = require ("express")
let routerUsers = express.Router()
const jwt = require("jsonwebtoken")
let database = require("../database")
let activeApiKeys = require("../activeApiKeys")
routerUsers.post("/",async(req,res)=>{
    let email = req.body.email
    let name = req.body.name
    let password = req.body.password

    let errors = []

    if (email==undefined||email=="")
        errors.push("no email")
    if (name==undefined||name=="")
        errors.push("no name")
    if (password==undefined||password=="")
        errors.push("no password")
    if (password.length<5)
        errors.push("password shorter than 5")
    if(errors.length>0)
        return res.status(400).json({errors:errors})

    database.connect()
    let userWithEmail = null
    let insertedUser=null
        try{
            userWithEmail = await database.query("SELECT * FROM users WHERE email=?",[email])
    
            if(userWithEmail.length>0){
                database.disconnect()
                return res.status(400).json({error: 'already user with that email'})
            }
            insertedUser = await database.query("INSERT INTO USERS (email,name,password) VALUES (?,?,?)",[email,name,password])
        }catch(e){
            database.disconnect()
            return res.status(400).json({error: 'problem inserting the user'})
        }
        database.disconnect()
        res.json({insertedUser:insertedUser})
})

routerUsers.post("/login",async(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let errors = []

    if(email==undefined||email=="")
        errors.push("no email")
    if(password==undefined||password=="")
        errors.push("no password")

    if(errors.length>0)
        return res.status(400).json({errors:errors})

    database.connect()

    let selectedUsers=[]
    let apiKey = null
    try{
        selectedUsers = await database.query("SELECT id,email FROM users WHERE email = ? AND password = ?",[email,password])
        database.disconnect()
        if(selectedUsers.length==0){
            
            return res.status(401).json({error:'invalid email or password'})
        }
        apiKey=jwt.sign({email:email,
            id:selectedUsers[0].id,
            time:Date.now()
        },"secret")
    }catch(e){
        database.disconnect()
        return res.status(400).json({error:'error in login'})
    }

    activeApiKeys.push(apiKey)

    res.json({apiKey:apiKey,id:selectedUsers[0].id,
        email:selectedUsers[0].email
    })
})

routerUsers.post("/disconnect",(req,res)=>{
    let apiKey = req.query.apiKey

    if(apiKey==undefined)
        return res.status(400).json({error: "no apiKey"})
    let index = activeApiKeys.indexOf(apiKey)
    if(index==-1)
        return res.status(400).json({error: "apiKey not registered"})
    activeApiKeys.splice(index,1)
    res.json({message:"apiKey deleted"})
})

module.exports=routerUsers