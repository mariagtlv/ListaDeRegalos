import { useEffect, useState } from "react";
import {backendUrl} from "../Globals"
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row , Typography, Alert} from "antd";

let RegisterUserComponent = () =>{
    let [name,setName] =useState(null)
    let [password,setPassword] =useState("")
    let [email,setEmail] =useState(null)

    let [message,setMessage]=useState("")
    let [error,setError]=useState({})
    let navigate = useNavigate()
    useEffect(()=>{
        checkData();
    },[name,email,password])

    let checkData = () =>{
        let newErrors = {}
        if( name == "" )
            newErrors.name= "Name must have a value"
        if(email == "" )
            newErrors.email= "Email must have a value"
        if(password == "" )
            newErrors.password= "Password must have a value"
        setError(newErrors)
    }
    let registerUser = async() =>{
        let response = await fetch(backendUrl+"/users",
        {method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                email:email,
                name:name,
                password:password
            }) 
        })
        if(response.ok){
            navigate("/login")
        }else{
            let jsonData = await response.json()
            let errors=""
            if(jsonData.errors!=null){
                jsonData.errors.array.forEach(e => {
                    errors+=e+" "
                });
                setMessage(errors)
            }else
                setMessage(jsonData.error)
            
        }
    }

    let {Text} = Typography

    return (
        <Row align="middle" style={{minHeight: "70vh"}} justify="center">
            <Col>
                {message!="" && <Alert type='error' message={message}/>}
                <Card title="Register" style={{width: "500px"}}>
                    <Input type="text" style={{marginBottom: "10px"}} placeholder="email" onChange={(e)=>setEmail(e.currentTarget.value)}/>
                    {error.email && <Text type="danger">{error.email}</Text>}
                    <Input type="text" style={{marginBottom: "10px"}}  placeholder="name" onChange={(e)=>setName(e.currentTarget.value)}/>
                    {error.name && <Text type="danger">{error.email}</Text>}
                    <Input type="text"  style={{marginBottom: "10px"}} placeholder="password" onChange={(e)=>setPassword(e.currentTarget.value)}/>
                    {error.password && <Text type="danger">{error.email}</Text>}
                    <Button type="primary" onClick={registerUser} block>Register</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default RegisterUserComponent;