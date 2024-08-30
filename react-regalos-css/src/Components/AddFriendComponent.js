import { useState } from "react";
import { backendUrl } from "../Globals";
import { Button, Card, Col, Input, Row, Alert } from 'antd'

let AddFriendComponent = (props) => {
    let {getMyFriends,createNotification} = props
    let [name,setName]=useState("")
    let [message,setMessage]=useState("")

    let addFriend = async() => {
        setMessage("")
        let response = await fetch(backendUrl+"/friends?apiKey="+localStorage.getItem("apiKey"),{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({emailFriend:name})
        })

        if(response.ok){
            createNotification("Friend added")
            getMyFriends()
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }
    return (
        <Row align="middle" style={{minHeight:"70vh"}} justify="center">
            
            <Col>
                {message!="" && <Alert type='error' message={message}/>}
                <Card title="Add Friend" style={{width: "500px"}}>
                    <Input  size='large' type='text' placeholder='Email' onChange={(e)=>setName(e.currentTarget.value)}/>
                    <Button style={{marginTop: "10px"}} type='primary' onClick={addFriend} block>Add</Button>
                </Card>
            </Col>
        </Row>
    )
}

export default AddFriendComponent;