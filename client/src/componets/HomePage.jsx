import React, {useEffect, useState, useRef} from 'react'
import MessageNotification from './MessageNotification'
import SearchBar from './SearchBar'
import ChatPanel from './ChatPanel'
import RightPanel from './RightPanel'
import Nav from './Nav'
import '../styles/global.css'
import '../styles/home_page.css'

const HomePage = () => {
    const [usersInChat, setUsersInChat] = useState('')

    const useCheckClickOutside = (handler) => {
        let domRef = useRef()
        useEffect(() => {
            let checkHandler = (e) => {
                if (!domRef.current.contains(e.target)) {
                    handler()
                }
            }
            document.addEventListener("mousedown", checkHandler)
            return () => {
                document.removeEventListener("mousedown", checkHandler)
            }
        });
        return domRef
    }
    const openChat = (usersInChat) =>{
        // open chat to the main chat panel on click
        // the current user isnt passed in the usersInchat var, grab if needed!
        setUsersInChat(usersInChat)
    }
    return (
        <div id='mainPageDiv'>
            <div className='navDiv'>
                <Nav/>
            </div>
            <div className='underNavCont'>
                <div className='colOne'>
                        <SearchBar useCheckClickOutside={useCheckClickOutside} openChat={openChat} />
                        <MessageNotification />
                </div>
                <div className='colTwo'>
                    <ChatPanel usersInChatProp={usersInChat}/>
                </div>
                <div className='colThree'>
                    <RightPanel/>
                </div>
            </div>
        </div>
    )
}

export default HomePage