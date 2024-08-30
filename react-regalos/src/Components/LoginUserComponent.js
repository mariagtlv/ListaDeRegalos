import { useState,useEffect } from "react";
import {backendUrl} from "../Globals"
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Input, Row, Typography, Alert } from 'antd'

let LoginUserComponent = (props) =>{
    let [password,setPassword] =useState(null)
    let [email,setEmail] =useState(null)

    let [message,setMessage]=useState("")
    let [error,setError]=useState({})

    let {setLogin}=props
    let navigate = useNavigate()
    useEffect(()=>{
        checkData();
    },[password,email])

    let checkData = () =>{
        let newErrors = {}
        if( password == "" )
            newErrors.password= "Password must have a value"
        if(email == "" )
            newErrors.email= "Email must have a value"
        setError(newErrors)
    }
    let loginUser = async() =>{
        let response = await fetch(backendUrl+"/users/login",
        {method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                email:email,
                password:password
            }) 
        })
        if(response.ok){
            let jsonData= await response.json()
            if(jsonData.apiKey!=null){
                localStorage.setItem("apiKey",jsonData.apiKey)
                localStorage.setItem("userId",jsonData.id)
                localStorage.setItem("email",jsonData.email)
            }
            setMessage("Logged in")
            setLogin(true)
            navigate("/myPresents")
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
    let {Text}=Typography

    return (

        <Row align="middle" style={{minHeight:"70vh"}} justify="center">
            
            <Col>
                {message!="" && <Alert type='error' message={message}/>}
                <Card title="Log In" style={{width: "500px"}}>
                    <Input  size='large' type='text' placeholder='Email' onChange={(e)=>setEmail(e.currentTarget.value)}/>
                    {error.email && <Text type='danger'>{error.email}</Text>}
                    <Input style={{marginTop: "10px"}} size='large' type='text' placeholder='Password' onChange={(e)=>setPassword(e.currentTarget.value)}/>
                    {error.password && <Text type='danger'>{error.password}</Text>}
                    <Button style={{marginTop: "10px"}} type='primary' onClick={loginUser} block>Enter</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default LoginUserComponent;