import { useState,useEffect } from "react";
import { backendUrl } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row , Typography, Alert} from "antd";
let AddPresentComponent = ( props)=>{
    let [present,setPresent] = useState({})
    let [message,setMessage] = useState("")
    let [error,setError]=useState({})
    
    let {createNotification}=props
    let navigate = useNavigate()
    useEffect(()=>{
        checkData();
    },[present])
    
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

    let checkData = () =>{
        let newErrors = {}
        if( present.name == "" )
            newErrors.name= "Name must have a value"
        if( present.description == "" )
            newErrors.description= "Description must have a value"
        if( present.price <0 )
            newErrors.price= "The price must have a positive value"
        if( present.price ="" )
            newErrors.price= "You must add a price"
        if( present.url == "" )
            newErrors.url= "Url must have a value"
        setError(newErrors)
    }

    let changeProperty = (propertyName, e)=>{
        let newPresent = {...present, [propertyName]:e.currentTarget.value}
        setPresent(newPresent)
    }

    let addPresentButton = async() =>{
        let newPresent = {...present,email:localStorage.getItem("email")}
        let response = await fetch(backendUrl+"/presents?apiKey="+localStorage.getItem("apiKey"),{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(newPresent)
        })
        if(response.ok){
            setMessage("Present uploaded")
            createNotification("Present correctly uploaded")
            navigate("/myPresents")
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }

    }

    let {Text}=Typography;
    return (
        <Row align="middle" style={{minHeight: "70vh"}} justify="center">
            <Col>
                {message!="" && <Alert type='error' message={message}/>}
                <Card title="Add Present" style={{width: "500px"}}>
                    <Input type="text" placeholder="name" style={{marginBottom: "10px"}} onChange={(e)=>changeProperty("name",e) }/>
                    {error.name && <Text type="danger">{error.name}</Text>}
                    <Input type="text" placeholder="description"  style={{marginBottom: "10px"}}  onChange={(e)=>changeProperty("description",e)}/>
                    {error.description && <Text type="danger">{error.description}</Text>}
                    <Input type="number" placeholder="price"  style={{marginBottom: "10px"}} onChange={(e)=>changeProperty("price",e)}/>
                    {error.price && <Text type="danger">{error.price}</Text>}
                    <Input type="text" placeholder="url"  style={{marginBottom: "10px"}} onChange={(e)=>changeProperty("url",e)}/>
                    {error.url && <Text type="danger">{error.url}</Text>}
                    <Button type="primary" onClick={addPresentButton} block>Add Present</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default AddPresentComponent;