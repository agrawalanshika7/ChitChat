
import { useEffect } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import { onAuthStateChanged } from "firebase/auth"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"
import { auth } from "./lib/firebase"

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore()
  const { chatId } = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)  /* 如果 user 为 null 或者 undefined，则不去尝试访问 uid 属性，避免出现运行时错误 */
    }) 

    return () => {
      unSub();
    }
  }, [fetchUserInfo])

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className='container'> 
      {currentUser ? (
        <>
          <List></List>
          {chatId && <Chat></Chat>}
          {chatId && <Detail></Detail>}
        </>
      ): (
        <Login></Login>
      )}
    </div> 
  )
}

export default App
