import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import { Link, useNavigate } from "react-router-dom";
import {List, Card} from 'antd'
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
        <>
            
            <List header={<h2>My Presents</h2>} grid={ {
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 6
            }} style={{marginLeft: "15px", marginRight: "15px"} } bordered dataSource={myPresents} renderItem={ (p)=> (
                <List.Item>
                    <Card title={p.name} style={{marginTop: "10px"}}>
                        <Link to={"/present/"+p.id}>{p.description}
                        </Link>
                    </Card>
                    
                    
                    
                </List.Item>
            )}>
            </List>
        </>
    )
}

export default MyPresentsComponent;