import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import {  useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
let EditPresentComponent = (props )=>{
    let [present,setPresent]=useState({})
    let [message,setMessage]=useState("")
    let {id}=useParams()
    let {createNotification}=props
    let navigate = useNavigate()
 
    useEffect(()=>{
        getMyPresent()
    },[])

    let getMyPresent = async() => {
        let response = await fetch(backendUrl+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"))
        
        if(response.status==401){
            navigate("/login")
            return
        }
        if(response.ok){
            let jsonData=await response.json()
            setPresent(jsonData[0])
        }else{
            let jsonData=await response.json()
            setMessage(jsonData.error)
        }
    }

    let changeProperty = (propertyName, e)=>{
        let newPresent = {...present, [propertyName]:e.currentTarget.value}
        setPresent(newPresent)
    }

    let editPresent = async() =>{
        let response = await fetch(backendUrl+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"PUT",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(present)
        })
        if(response.ok){
            createNotification("Present correctly updated")
            navigate("/myPresents")
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    return (
        <div>
        <h2>Edit Present</h2>
        <div className="present-edit">
            {message!=""&&<h3>{message}</h3>}
            <input type="text" placeholder="name" value={present.name} onChange={(e)=>{changeProperty("name",e)}}/>
            <input type="text" placeholder="description" value={present.description} onChange={(e)=>{changeProperty("description",e)}}/>
            <input type="text" placeholder="url" value={present.url} onChange={(e)=>{changeProperty("url",e)}}/>
            <input type="number" placeholder="price" value={present.price} onChange={(e)=>{changeProperty("price",e)}}/>
            
            <button onClick={editPresent}>Edit</button>
        </div>
        
    </div>
)
}

export default EditPresentComponent;