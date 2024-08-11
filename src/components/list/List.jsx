import "./list.css"
import UserInfo from "./userInfo/Userinfo"
import ChatList from "./chatList/Chatlist"

const List = () => {
    return (
        <div className="list">
            <UserInfo></UserInfo>
            <ChatList></ChatList>
        </div>
    )
}

export default List