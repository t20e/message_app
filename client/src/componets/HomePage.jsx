import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home_page.css';
import '../styles/global.css'
import ChatPanel from './ChatPanel';
import MsgNotification from './MsgNotification';
import Nav from './Nav';
import SearchBar from './SearchBar';
import { UserContext } from '../context/UserContext'
import UserSettings from './popUps/UserSettings';
import UserProfile from './popUps/UserProfile';
import chat_panel_css from '../styles/chat_panel.module.css'
import GitLink from './GitLink';
import { SocketContext } from '../context/SocketContext';


const HomePage = () => {
    const socket = useContext(SocketContext);

    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [usersInChatId, setUsersInChatId] = useState(false)
    const redirect = useNavigate()
    const [blurPage, setblurPage] = useState(false)
    // 
    const [userProfilePopUp, setUserProfilePopUp] = useState(false)
    const [settingsPopUp, setSettingsPopUp] = useState(false);
    useEffect(() => {
        if (loggedUser === undefined) {
            axios.get('http://localhost:8000/api/user/logUser', { withCredentials: true })
                .then(res => {
                    // console.log('logged in user', res.data);
                    if (res.data.results === null) {
                        redirect('/regLogin')
                    }
                    setLoggedUser(res.data.results)
                    localStorage.setItem('_id', res.data.results._id)
                })
                .catch(err => {
                    console.log('err getting logged user');
                    redirect('/regLogin')
                })
        }
    }, []);
    useEffect(() => {
        socket.on("connect", () => {
            console.log("socket_id: ", socket.id);
            socket.emit("setUserActive", localStorage.getItem("_id"));
        });
        return () => socket.disconnect(true);
    }, [socket]);

    const openSettingsPopUp = () => {
        setSettingsPopUp(!settingsPopUp)
        setblurPage(!blurPage);
    }
    const openProfilePopUp = () => {
        setUserProfilePopUp(!userProfilePopUp)
        setblurPage(!blurPage);
    }

    const openChat = (users) => {
        users.push(loggedUser._id)
        setUsersInChatId({ 'members': users })
    }
    const useCheckClickOutside = (handler) => {
        let domRef = useRef()
        useEffect(() => {
            if (domRef.current !== undefined) {
                let checkHandler = (e) => {
                    if (!domRef.current.contains(e.target)) {
                        handler()
                    }
                }
                document.addEventListener("mousedown", checkHandler)
                return () => {
                    document.removeEventListener("mousedown", checkHandler)
                }
            }
        });
        return domRef
    }
    const getCurrTime = () => {
        var date = new Date();
        var yyyy = (date.getFullYear());
        var mm = (date.getMonth() + 1);
        var dd = (date.getUTCDate() - 1);
        let hr = (date.getHours())
        let min = (date.getMinutes())
        // date = mm + '-' + dd + '-' + yyyy+ '-' + time;
        date = { "year": yyyy, "month": mm, "day": dd, "hour": hr, "min": min }
        return date
    }

    return (
        <div id='mainPageDiv'>
            <span className={blurPage ? 'blurBehindPopUp' : null}>
                <div className='navBar'>
                    <Nav openSettingsPopUp={openSettingsPopUp} openProfilePopUp={openProfilePopUp} usersInChatIdProp={usersInChatId} useCheckClickOutside={useCheckClickOutside} />
                </div>
                <div className='underNavCont'>
                    <div className='colOne'>
                        <SearchBar useCheckClickOutside={useCheckClickOutside} openChat={openChat} />
                        <MsgNotification  openChat={openChat} />
                    </div>
                    <div className='colTwo'>
                        {usersInChatId === false
                            ?
                            <div className={`${chat_panel_css.mainCont} noChatSelected`}>select or search a user to create a chat</div>
                            :
                            <ChatPanel  useCheckClickOutside={useCheckClickOutside} usersInChatIdProp={usersInChatId} getCurrTime={getCurrTime} />
                        }
                    </div>
                </div>
            </span>
            <div>
                <GitLink />
            </div>
            {settingsPopUp ? (
                <UserSettings useCheckClickOutside={useCheckClickOutside} openSettingsPopUp={openSettingsPopUp} />
            )
                : null
            }
            {userProfilePopUp ?
                <UserProfile openProfilePopUp={openProfilePopUp} useCheckClickOutside={useCheckClickOutside} />
                : null
            }
        </div>
    )
}

export default HomePage