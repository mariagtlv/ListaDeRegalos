import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Col, Descriptions, Input, Row, Typography } from 'antd';
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

    let {Text}=Typography;

    return (
        <div>
            {message!=""&&<Text type="alert">{message}</Text>}
            <Descriptions title={present.name} layout='vertical' style={{margin: "10px"}}>
                <Descriptions.Item label="Description" span={3}>{present.description}</Descriptions.Item>
                <Descriptions.Item label="Price">{present.price} €</Descriptions.Item>
                <Descriptions.Item label="Posted by">{present.email}</Descriptions.Item>
                {present.chosenBy!=null && <Descriptions.Item label="Gifted by">{present.chosenBy}</Descriptions.Item>}
                
                {localStorage.getItem("email")==present.email && (

                
                <Descriptions.Item span={3}>
                    <Row justify="center" style={{width: "100%"}}>
                        <Col style={{margin: "10px"}}>
                            <Button type='primary' onClick={editPresent} style={{marginRight: "10px"}} block>Edit</Button>
                        </Col>
                        <Col style={{margin: "10px"}}>
                            <Button type='primary' onClick={deletePresent} style={{marginRight: "10px"}}  block>Delete</Button>
                        </Col>
                    </Row>
                    
                </Descriptions.Item>
                )}
                
            </Descriptions>
        </div>

)
}

export default PresentComponent;