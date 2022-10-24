import { useState, createContext } from "react";
export const AllChatsContext = createContext()

export const AllChatsProvider = (props) => {
    const [allChatsState, setAllChatsState] = useState({
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
        <AllChatsContext.Provider value={{ allChatsState, setAllChatsState }}>
            {props.children}
        </AllChatsContext.Provider>
    )
}