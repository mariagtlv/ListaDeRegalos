const express = require("express")
let routerFriends = express.Router()

let database = require("../database")

routerFriends.post("/",async (req,res)=>{
    let emailMainUser = req.infoApiKey.email
    let emailFriend = req.body.emailFriend

    if(emailFriend==undefined)
        return res.status(400).json({error: "no email"})

    database.connect()

    let user = null
    try{
        user = await database.query("SELECT email FROM users WHERE email=?",[emailFriend])
        if(user.length==0)
            return res.status(400).json({error: "no user with that email"})
        await database.query("INSERT INTO friends (emailMainUser, emailFriend) VALUES (?,?)",[emailMainUser,emailFriend])
    }catch(e){
        return res.status(400).json({error: "could not add friend"})
    }

    database.disconnect()
    res.json({added:true})
})

routerFriends.get("/",async (req,res)=>{
    let emailMainUser = req.infoApiKey.email
    
    database.connect()

    let friends = []
    try{
        friends = await database.query("SELECT emailFriend FROM friends WHERE emailMainUser=?",[emailMainUser])
    }catch(e){
        return res.status(400).json({error: "could not find friends"})
    }

    database.disconnect()
    res.json({friends:friends})
})

module.exports=routerFriends