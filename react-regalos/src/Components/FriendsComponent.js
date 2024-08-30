import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import AddFriendComponent from "./AddFriendComponent";
import {Button, List, Alert} from 'antd'

let FriendsComponent = (props) => {

    let {createNotification}=props
    let [friends,setFriends] = useState([])
    let [message,setMessage]=useState("")
    useEffect(()=>{
        getMyFriends()
    },[])
    

    let getMyFriends = async () => {
        let response = await fetch(backendUrl+"/friends?apiKey="+localStorage.getItem("apiKey"))
        if(response.ok){
            let jsonData = await response.json()
            setFriends(jsonData.friends)
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }

    let deleteFriend = async(email)=>{
        let response = await fetch(backendUrl+"/friends?emailFriend="+email+"&apiKey="+localStorage.getItem("apiKey"),{
            method: "DELETE"
        })
        if(response.ok){
            getMyFriends()
            createNotification("Friend is deleted","success")
        }else{
            let jsonData = await response.json()
            createNotification(jsonData.error)
        }
    }
    return (
        <>
            {message!="" && <Alert type='error' message={message}/>}
            <List size="large" header={<h2>My Friends</h2>} bordered dataSource={friends} renderItem={(f)=>(
                <List.Item>
                        <p>{f.emailFriend}</p>
                        <Button onClick={()=>deleteFriend(f.emailFriend)}>Delete</Button>
                </List.Item>
            )}>
            </List>
            <AddFriendComponent getMyFriends={getMyFriends} createNotification={createNotification}/>
        </>

    )
}

export default FriendsComponent;