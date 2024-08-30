import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
let PresentComponent = ( props)=>{
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

    let deletePresent = async () => {
        let response = await fetch(backendUrl+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),{
            method:"DELETE"
        })
        if(!response.ok){
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
        else{
            createNotification("Present deleted")
            navigate("/myPresents")
        }
    }

    let editPresent = () => {
        navigate("/edit/"+id)
    }


    return (
        <div>
        <h2>Present</h2>
        <div className="present-container">
            {message!=""&&<h3>{message}</h3>}
            <p>Name: {present.name}</p>
            <p>Description: {present.description}</p>
            <p>Price: {present.price} €</p>
            <p>Posted by: {present.email}</p>
            <button onClick={editPresent}>Edit</button>
            <button onClick={deletePresent}>Delete</button>
        </div>
        
    </div>

)
}

export default PresentComponent;