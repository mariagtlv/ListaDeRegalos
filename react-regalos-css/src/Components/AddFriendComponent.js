import { useState } from "react";
import { backendUrl } from "../Globals";


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
        <div className="add-friend-container">
            <h2>Add a friend</h2>
            {message!=""&&<p>{message}</p>}
            <form>
                <div>
                    <input type="text" placeholder="email" onChange={e=>setName(e.currentTarget.value)}/>
                </div>
                <button onClick={addFriend}>Add</button>
            </form>
        </div>
    )
}

export default AddFriendComponent;