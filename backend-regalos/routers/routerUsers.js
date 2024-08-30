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
        errors.push("No email")
    if (name==undefined||name=="")
        errors.push("No name")
    if (password==undefined||password=="")
        errors.push("No password")
    if (password.length<5)
        errors.push("Password shorter than 5 characters")
    if(errors.length>0)
        return res.status(400).json({errors:errors})

    database.connect()
    let userWithEmail = null
    let insertedUser=null
        try{
            userWithEmail = await database.query("SELECT * FROM users WHERE email=?",[email])
    
            if(userWithEmail.length>0){
                database.disconnect()
                return res.status(400).json({error: 'Already a user with that email'})
            }
            insertedUser = await database.query("INSERT INTO USERS (email,name,password) VALUES (?,?,?)",[email,name,password])
        }catch(e){
            database.disconnect()
            return res.status(400).json({error: 'Problem inserting the user'})
        }
        database.disconnect()
        res.json({insertedUser:insertedUser})
})

routerUsers.post("/login",async(req,res)=>{
    let email = req.body.email
    let password = req.body.password

    let errors = []

    if(email==undefined||email=="")
        errors.push("No email")
    if(password==undefined||password=="")
        errors.push("No password")

    if(errors.length>0)
        return res.status(400).json({errors:errors})

    database.connect()

    let selectedUsers=[]
    let apiKey = null
    try{
        selectedUsers = await database.query("SELECT id,email FROM users WHERE email = ? AND password = ?",[email,password])
        database.disconnect()
        if(selectedUsers.length==0){
            
            return res.status(401).json({error:'Invalid email or password'})
        }
        apiKey=jwt.sign({email:email,
            id:selectedUsers[0].id,
            time:Date.now()
        },"secret")
    }catch(e){
        database.disconnect()
        return res.status(400).json({error:'Error in login'})
    }

    activeApiKeys.push(apiKey)

    res.json({apiKey:apiKey,id:selectedUsers[0].id,
        email:selectedUsers[0].email
    })
})

routerUsers.post("/disconnect",(req,res)=>{
    let apiKey = req.query.apiKey

    if(apiKey==undefined)
        return res.status(400).json({error: "No apiKey"})
    let index = activeApiKeys.indexOf(apiKey)
    if(index==-1)
        return res.status(400).json({error: "apiKey not registered"})
    activeApiKeys.splice(index,1)
    res.json({message:"apiKey deleted"})
})

module.exports=routerUsers