import { useState,useEffect } from "react";
import { backendUrl } from "../Globals";
import { Link, useNavigate } from "react-router-dom";

let PresentsOfUserComponent = (props) =>{
    let {createNotification}=props
    let [email,setEmail] = useState("")
    let [presents,setPresents]=useState([])
    let navigate = useNavigate()

    useEffect(()=>{
        checkIfLogin()
    },[])

    let checkIfLogin = async ()=>{
        let response = await fetch(backendUrl+"/presents?apiKey="+localStorage.getItem("apiKey"))
        if(response.status==401){
            navigate("/login")
            return
        }
    }

    let findUser = async()=>{
        let response = await fetch(backendUrl+"/presents?apiKey="+localStorage.getItem("apiKey")+"&userEmail="+email)
        if(response.ok){
            let jsonData = await response.json()
            setPresents(jsonData)
        }else{
            let jsonData = await response.json()
            createNotification("You are not friends","error")
            setPresents([])
        }
    }

    let giftPresent = async(id)=>{
        let response = await fetch(backendUrl+"/presents/"+id+"?apiKey="+localStorage.getItem("apiKey"),
        {
            method:"PUT",
            headers:{"Content-Type":"application/json"}
        })
        if(response.ok){
            createNotification("You are gifting this present")
            navigate("/present/"+id)
        }else{
            let jsonData = await response.json()
            createNotification(jsonData.error,"error")
        }
    }
    return (
        <div>
            
            <h2>Find present by user</h2>
            <div className="find-present-container">
                <input type='text' placeholder="email" onChange={(e)=>setEmail(e.currentTarget.value)}/>
                <button onClick={findUser}>Find</button>
            </div>

            {presents.length>0 && (
                <div className="presents-container">
                <h2>Presents by {presents[0].email}</h2>
                <ul>
                    {presents.map(p=><li>
                            <p>{p.name}</p>
                            <button onClick={()=>giftPresent(p.id)}>Gift</button>
                        </li>)}
                </ul>
                </div>
            )}
        </div>
    )
}

export default PresentsOfUserComponent;