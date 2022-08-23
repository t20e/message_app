import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import MessageNotification from './MessageNotification'
import SearchBar from './SearchBar'
import ChatPanel from './ChatPanel'
import RightPanel from './RightPanel'
import Nav from './Nav'
import '../styles/global.css'
import '../styles/home_page.css'
import axios from 'axios'

const HomePage = () => {
    const [loggedUser, setLoggedUser] = useState({});
    const [usersInChat, setUsersInChat] = useState('')
    const redirect = useNavigate()
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/logUser',{withCredentials:true})
            .then(res=>{
                console.log('logged in user', res.data);
                setLoggedUser(res.data.results)
                // console.log(loggedUser);
            })
            .catch(err=>{
                console.log('err getting logged user');
                redirect('/regLogin')
            })
    }, []);
    const openChat = (usersInChat) => {
        // open chat to the main chat panel on click

        setUsersInChat(usersInChat)
    }
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
    return (
        <div id='mainPageDiv'>
            <div className='navBar'>
                <Nav />
            </div>
            <div className='underNavCont'>
                <div className='colOne'>
                    <SearchBar useCheckClickOutside={useCheckClickOutside} openChat={openChat} />
                    <MessageNotification />
                </div>
                <div className='colTwo'>
                    <ChatPanel usersInChatProp={usersInChat} loggedUserProp={loggedUser} />
                </div>
                <div className='colThree'>
                    <RightPanel />
                </div>
            </div>
        </div>
    )
}

export default HomePage