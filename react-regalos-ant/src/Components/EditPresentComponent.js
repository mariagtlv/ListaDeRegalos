import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import {  useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row,  Alert } from 'antd'
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
            createNotification("Present correctly updated","success")
            navigate("/myPresents")
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    return (
        <Row align="middle" style={{minHeight:"70vh"}} justify="center">
            
            <Col>
                {message!="" && <Alert type='error' message={message}/>}
                <Card title="Edit Present" style={{width: "500px"}}>
                    <Input  style={{marginBottom: "10px"}}   size='large' type='text' placeholder='Name' value={present.name} onChange={(e)=>{changeProperty("name",e)}}/>
                    <Input  style={{marginBottom: "10px"}}  size='large' type='text' placeholder='Description' value={present.description} onChange={(e)=>{changeProperty("description",e)}}/>
                    <Input   style={{marginBottom: "10px"}} size='large' type='text' placeholder='Url' value={present.url} onChange={(e)=>{changeProperty("url",e)}}/>
                    <Input  style={{marginBottom: "10px"}}  size='large' type='number' placeholder='Price' value={present.price} onChange={(e)=>{changeProperty("price",e)}}/>
                    <Button style={{marginTop: "10px"}} type='primary' onClick={editPresent} block>Edit</Button>
                </Card>
            </Col>
        </Row>
)
}

export default EditPresentComponent;