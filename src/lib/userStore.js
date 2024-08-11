import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false });
        
        try {
            const docRef = doc(db, "users", uid);  /* 这一步是创建 引用，你可以理解为是，获取指针/地址 */
            const docSnap = await getDoc(docRef)   /* 这一是提取引用中的数据，可以理解为跟随指针获取特定位置的数据 */

            if (docSnap.exists()) {
                set({currentUser: docSnap.data(), isLoading:false})
            } else {
                set({currentUser: null, isLoading: false})
            }
        } catch(err){
            console.log(err)  /* 控制台输出错误信息，调试就靠这个 */
            return set({ currentUser: null, isLoading: false });
        }
    }
}))