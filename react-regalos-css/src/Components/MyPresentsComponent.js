import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import { Link, useNavigate } from "react-router-dom";
let MyPresentsComponent = ( )=>{
    let [myPresents,setMyPresents] = useState([])
    let navigate = useNavigate()

    useEffect(()=>{
        getMyPresents()
    },[])

    let getMyPresents = async() => {
        let response = await fetch(backendUrl+"/presents?apiKey="+localStorage.getItem("apiKey"))
        
        if(response.status==401){
            navigate("/login")
            return
        }
        if(response.ok){
            let jsonData=await response.json()
            setMyPresents(jsonData)
        }
    }

    return (
        <div>
        <h2>My Presents</h2>
        {myPresents.length>0 && (
            <ul className="present-list">
            {myPresents.map(p=>(<li className="present-list-item">
                <Link to={"/present/"+p.id} className="present-link">
                {p.name}
                </Link>
            </li>))}
        </ul>)}
        
    </div>
    )
}

export default MyPresentsComponent;