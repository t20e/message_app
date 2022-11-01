import { useState, createContext } from "react";
export const AllChatsContext = createContext()

export const AllChatsProvider = (props) => {
    const [chatsContext, setChatsContext] = useState({
        // get the curr chat id to retreive data from allChats
        allChats:{
            // chatId : '12323':{
                                    // messages: [],
                                    // memebers : []
                                    // }
        },
        currChatId : undefined
    })
    return (
        <AllChatsContext.Provider value={{ chatsContext, setChatsContext }}>
            {props.children}
        </AllChatsContext.Provider>
    )
}