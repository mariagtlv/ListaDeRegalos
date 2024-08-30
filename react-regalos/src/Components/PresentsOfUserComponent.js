import { useState,useEffect } from "react";
import { backendUrl } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row, Alert, List } from 'antd'

let PresentsOfUserComponent = (props) =>{
    let {createNotification}=props
    let [email,setEmail] = useState("")
    let [presents,setPresents]=useState([])
    let [message,setMessage]=useState("")
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
        setMessage("")
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
        <>
            <Row align="middle" justify="center" style={{marginTop:"50px", marginBottom: "20px"}}>
                <Col>
                    <Card title="Find Present by User" style={{width: "500px"}}>
                        <Input  size='large' type='text' placeholder='Email' onChange={(e)=>setEmail(e.currentTarget.value)}/>
                        <Button style={{marginTop: "10px"}} type='primary' onClick={findUser} block>Find</Button>
                    </Card>
                </Col>
            </Row>
            {presents.length>0 && (
                
                <List size="large" header={<h2>Presents by {presents[0].email}</h2>} bordered dataSource={presents} renderItem={(p)=>(
                    <List.Item>
                            <p>{p.name}</p>
                            <Button onClick={()=>giftPresent(p.id)}>Gift</Button>
                    </List.Item>
                )}>
                </List>
            )}
        </>
    )
}

export default PresentsOfUserComponent;