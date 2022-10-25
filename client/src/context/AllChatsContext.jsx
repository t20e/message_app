import { useState, createContext } from "react";
export const AllChatsContext = createContext()

export const AllChatsProvider = (props) => {
    const [chatsContext, setChatsContext] = useState({
        currChat_id : undefined,
        currUsersInChat: undefined,
        allChats:{
            // chatId : '12323':{
                // messages: [],
                // memebers : []
            // }
        }
    })
    return (
        <AllChatsContext.Provider value={{ chatsContext, setChatsContext }}>
            {props.children}
        </AllChatsContext.Provider>
    )
}