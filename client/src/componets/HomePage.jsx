import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
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
import GitLink from './GitLink';
import { AllChatsContext } from "../context/AllChatsContext"
import { SocketContext, socket } from '../context/SocketContext';

const HomePage = () => {
    const { chatsContext, setChatsContext } = useContext(AllChatsContext)
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [usersInChatId, setUsersInChatId] = useState(false)
    const redirect = useNavigate()
    const [blurPage, setblurPage] = useState(false)
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);
    // 
    const [userProfilePopUp, setUserProfilePopUp] = useState(false)
    const [settingsPopUp, setSettingsPopUp] = useState(false);
    useEffect(() => {
        if (loggedUser === undefined) {
            // console.log('user is signing in from cookie')
            axios.get('http://localhost:8000/api/chatapp/user/logUser', { withCredentials: true })
                .then(res => {
                    // console.log('logged in user', res.data);
                    if (res.data.results === null) {
                        redirect('/regLogin')
                    }
                    setLoggedUser(res.data.results)
                    localStorage.setItem('_id', res.data.results._id)
                    // console.log('getting active users')
                })
                .catch(err => {
                    console.log('err getting logged user');
                    redirect('/chatapp/regLogin')
                })
        }
    }, [loggedUser !== undefined?loggedUser._id : null]);
    useEffect(() => {
        socket.on('connect', () => {
            console.log("socket_id: ", socket.id);
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            // socket.off('pong');
        }
    }, [isConnected]);

    useEffect(() => {
        if (loggedUser !== undefined) { addUserActivity(loggedUser._id) }
    }, [loggedUser])

    const addUserActivity = (id) => {
        console.log('adding user to active obj')
        socket.emit('addUserToObj', id)
        socket.emit('getActiveUsers')
    }

    const convertUnicode = (str) => {
        // console.log(str, 'str')
        if (str.includes('%@')) {
            // console.log('has emoji');
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '%' && str[i + 1] === '@') {
                    // i is the start
                    let end;
                    for (let v = i + 1; v < str.length; v++) {
                        if (str[v] === "$" && str[v - 1] === "#") {
                            end = v + 1
                            break;
                        }
                    }
                    // console.log(str[i], str[end], i, end)
                    let removeSymbols = str.substring(i, end);
                    removeSymbols = removeSymbols.slice(2, removeSymbols.length - 2)
                    // console.log(removeSymbols, 'remove symbols');
                    let emoji = String.fromCodePoint(parseInt(removeSymbols, 16))
                    // console.log(emoji)
                    let newStr = str.slice(0, i - 1) + " " + emoji + " " + str.slice(end);
                    // console.log(newStr)
                    str = newStr
                }
            }
        }
        return str
    }

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
        const date = new Date();
        const yyyy = (date.getFullYear());
        const mm = (date.getMonth() + 1);
        const dd = (date.getUTCDate() - 1);
        const hr = (date.getHours())
        const min = (date.getMinutes())
        // date = mm + '-' + dd + '-' + yyyy+ '-' + time;
        const timeStamp = { "year": yyyy, "month": mm, "day": dd, "hour": hr, "min": min }
        return timeStamp
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
                        <MsgNotification convertUnicode={convertUnicode} openChat={openChat} />
                    </div>
                    <div className='colTwo'>
                        <ChatPanel addUserActivity={addUserActivity} convertUnicode={convertUnicode} useCheckClickOutside={useCheckClickOutside} usersInChatIdProp={usersInChatId} getCurrTime={getCurrTime} />
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