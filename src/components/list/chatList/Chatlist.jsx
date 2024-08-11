import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser"
import { useUserStore } from "../../../lib/userStore"
import { useChatStore } from "../../../lib/chatStore"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"

const ChatList = () => {
    const [chats, setChats] = useState([])
    const [addMode, setAddMode] = useState(false)
    const [input, setInput] = useState("")

    const { currentUser } = useUserStore()
    const { chatId, changeChat } = useChatStore()

    useEffect(() => {
      
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
           

            const items = res.data().chats

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId)
                const userDocSanp = await getDoc(userDocRef)

                const user = userDocSanp.data()

                return {...item, user}
            })

            const chatData = await Promise.all(promises)  

            setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))  // sccript sort 
        })  

       
        return () => {
            unSub()  
        }
    }, [currentUser.id])

    const handleSelect = async (chat) => {
        const userChats = chats.map((item) => {
          const { user, ...rest } = item;
          return rest;
        });
    
        const chatIndex = userChats.findIndex(
          (item) => item.chatId === chat.chatId
        );
    
        userChats[chatIndex].isSeen = true;
    
        const userChatsRef = doc(db, "userchats", currentUser.id);
    
        try {
          await updateDoc(userChatsRef, {
            chats: userChats,
          });
          changeChat(chat.chatId, chat.user);
        } catch (err) {
          console.log(err);
        }
      };

    const filteredChats = chats.filter((c) =>
        c.user.username.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className="chatList">
            {/* search 类 */}
            <div className="search">
                {/* search 类下的第一个组件： searchBar */}
                <div className="searchBar">
                    <img src="./search.png" alt="" />  {/* 图标 */}
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)}/>   {/* 文本输入框，默认填充为 Search */}
                </div>
                {/* search 类下的第二个组件： 图标 */}
                <div>
                    <img src={addMode ? "minus.png" : "./plus.png"} alt="" className="add" onClick={() => setAddMode((prev) => !prev)}/>
                </div>
            </div>
            {/* 下面是 好友列表，这里我们暂时添加了 4 个用户*/}
            {filteredChats.map((chat) => (
                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}
                style={{
                    backgroundColor: chat?.isSeen? "transparent" : "#5183fe"
                }}
                >
                    <img
                        src={
                        chat.user.blocked.includes(currentUser.id)
                            ? "./avatar.png"
                            : chat.user.avatar || "./avatar.png"
                        }
                        alt=""
                    />
                    <div className="texts">
                    <span>
                        {chat.user.blocked.includes(currentUser.id)
                            ? "User"
                            : chat.user.username}
                    </span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            
            {addMode && <AddUser></AddUser>}   {/* 只有处于 addMode 状态时才展示该框体 */}
        </div>
    )
}

export default ChatList