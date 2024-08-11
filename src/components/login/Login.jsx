import { useState } from "react";
import "./login.css"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url:""
    })

    const [loading, setLoading] = useState(false)

    const handleAvatar = e => {
        if(e.target.files[0]){   /* 如果选择了文件，则将 avatar["url"] 设置为选中文件的 url */
            setAvatar(
                {
                    file:e.target.files[0],
                    url: URL.createObjectURL(e.target.files[0])
                }
            )
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target);  /* e.target 指向触发事件的元素 */

        const { email, password } = Object.fromEntries(formData)  // 将 FormData 对象转换为普通对象，并解构出 username, email, password 字段

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch(err) {
            console.log(err)
            toast.error()
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();        /* 对于表单提交事件，默认行为是刷新界面，使用这个方法可以阻止这种默认行为 */
        setLoading(true)
        const formData = new FormData(e.target);  /* e.target 指向触发事件的元素 */

        const { username, email, password } = Object.fromEntries(formData)  // 将 FormData 对象转换为普通对象，并解构出 username, email, password 字段

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password) 

            const imgUrl = await upload(avatar.file)  /*Upload 方法：返回 imgUrl */

            await setDoc(doc(db, "users", res.user.uid), {   /* 在 集合和文档这种结构之中，集合相当于一个表，文档名称相当于 id，文档名称 + 其中内容共同组成表中的一个元组 */
                username,     
                email,
                avatar:imgUrl,
                id: res.user.uid,  /* 把文档名称单独取出来，放到组件内部，方便查找使用 */
                blocked: [],   /* 黑名单，被屏蔽的用户的 uid */
            })

            await setDoc(doc(db, "userchats", res.user.uid), {  /* 在 集合和文档这种结构之中，集合相当于一个表，文档名称相当于 id，文档名称 + 其中内容共同组成表中的一个元组 */
                chats: [],   /* 该用户的所有聊天记录 */
            })

            toast.success("Account created successfully! You can login now!")  /* 不知道为啥，这行代码不工作 */
        } catch(err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return <div className="login">
        <div className="item">
            <h2>Welcome back!</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name="email"/>
                <input type="text" placeholder="Password" name="password"/>
                <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>  {/* loading 期间不能再点击按钮 */}
            </form>
        </div>
        <div className="separator"></div>
        <div className="item">
            <h2>Create an Account!</h2>
            <form onSubmit={handleRegister}>  {/* 添加表单提交事件 */}
                <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="" />
                Upload an image</label>  {/* 点击该 label 时，自动跳转到 id 为 file 的组件*/}
                <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
                <input type="Username" placeholder="Username" name="username"/>
                <input type="text" placeholder="Email" name="email"/>
                <input type="text" placeholder="Password" name="password"/>
                <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
            </form>
        </div>
    </div>
} 

export default Login;