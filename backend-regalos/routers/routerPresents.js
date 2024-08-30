const express = require("express")
const database = require("../database")

let routerPresents = express.Router()

routerPresents.post("/",async (req,res)=>{
    let name = req.body.name
    let description = req.body.description
    let url = req.body.url
    let price = req.body.price

    let errors=[]
    if(name==undefined||name=="")
        errors.push("no name")
    if(description==undefined||description=="")
        errors.push("no description")
    if(url==undefined||url=="")
        errors.push("no url")
    if(price==undefined||price=="")
        errors.push("no price")
    price=parseFloat(price)

    if(errors.length>0)
        return res.status(400).json({error: "something went wrong"})

    database.connect()

    let insertedGift = null
    try{
        insertedGift=await database.query("INSERT INTO gift(name,url,description,price,email)VALUES (?,?,?,?,?)",[name,url,description,price,req.infoApiKey.email])
    }catch(e){
        database.disconnect()
        return res.status(400).json({error: 'error'})
    }
    database.disconnect()
    res.json(insertedGift)
})

routerPresents.get("/",async (req,res)=>{
    let userEmail = req.query.userEmail

    let myEmail=req.infoApiKey.email
    database.connect()

    let userGifts = null
    let relationship = null

    if(userEmail==undefined){
        try{
            userGifts=await database.query("SELECT * FROM gift WHERE email=?",[myEmail])
        }catch(e){
            database.disconnect()
            return res.status(400).json({error: 'error'})
        }
    }else{
        try{
            relationship = await database.query("SELECT * FROM friends WHERE emailMainUser=? AND emailFriend=?",[userEmail,myEmail])
            if(relationship.length==0)
                return res.status(400).json({error:"you are not friends"})
            userGifts=await database.query("SELECT * FROM gift WHERE email=?",[userEmail])
        }catch(e){
            database.disconnect()
            return res.status(400).json({error: 'error'})
        }
    }
    
    
    database.disconnect()
    res.json(userGifts)
})

routerPresents.get("/:id",async (req,res)=>{
    let id = req.params.id

    database.connect()
    let userGift = null
    try{
        userGift=await database.query("SELECT * FROM gift WHERE id=?",[id])
    }catch(e){
        database.disconnect()
        return res.status(400).json({error: 'error'})
    }
    database.disconnect()
    res.json(userGift)
})

routerPresents.delete("/:id",async(req,res)=>{
    let id = req.params.id
    if(id==undefined)
        return res.status(400).json({error: "no id"})

    let email=req.infoApiKey.email

    database.connect()

    try{
        let gift = await database.query("SELECT * FROM gift WHERE id=? AND email=?",[id,email])
        if(gift.length==0){
            database.disconnect()
            return res.status(400).json({error:"no gift with that id"})
        }
        await database.query("DELETE FROM gift WHERE id=?",[gift[0].id])
    }catch(e){
        return res.status(400).json({error: "something went wrong"})
    }

    database.disconnect()
    res.json({deleted:true})
})

routerPresents.put("/:id",async(req,res)=>{
    let id = req.params.id
    if(id==undefined)
        return res.status(400).json({error: "no id"})

    let email=req.infoApiKey.email

    database.connect()
    let gift = null
    try{
        gift = await database.query("SELECT * FROM gift WHERE id=?",[id])
        if(gift.length==0){
            database.disconnect()
            return res.status(400).json({error:"no gift with that id for that user"})
        }
    }catch(e){
        return res.status(400).json({error: "something went wrong"})
    }
    
    let updatedItem=null
    if(gift[0].email==email){
        let name = req.body.name
        let description = req.body.description
        let url = req.body.url
        let price=req.body.price

        if(name==undefined||name=="")
            name=gift[0].name
        if(description==undefined||description=="")
            description=gift[0].description
        if(url==undefined||url=="")
            url=gift[0].url
        if(price==undefined||price=="")
            price=gift[0].price
        else
            price=parseFloat(price)

    
        
        try{
            updatedItem = await database.query("UPDATE gift SET name=?,description=?,url=?,price=? WHERE id=?",[name,description,url,price,id])
        }catch(e){
            return res.status(400).json({error: "something went wrong"})
        }
    }else{
        
        try{
            updatedItem = await database.query("UPDATE gift SET chosenBy=? WHERE id=?",[email,id])
        }catch(e){
            return res.status(400).json({error: "something went wrong"})
        }
    }

    database.disconnect()
    res.json({updated:true})
})


module.exports = routerPresents