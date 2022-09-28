import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home_page.css';
import '../styles/global.css'
import ChatPanel from './ChatPanel';
import MsgNotification from './MsgNotification';
import Nav from './Nav';
import RightPanel from './RightPanel';
import SearchBar from './SearchBar';
import {UserContext} from '../context/UserContext'

const HomePage = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    // const [loggedUser, setLoggedUser] = useState({});
    const [usersInChat, setUsersInChat] = useState(false)
    const redirect = useNavigate()

    useEffect(() => {
        if (loggedUser !== {} && localStorage.getItem('userToken')) {
            axios.get('http://localhost:8000/api/user/logUser', { withCredentials: true })
                .then(res => {
                    console.log('logged in user', res.data);
                    res.data.results === null ?
                        redirect('regLogin') :
                        setLoggedUser(res.data.results)
                })
                .catch(err => {
                    console.log('err getting logged user');
                    redirect('/regLogin')
                })
        } else {
            redirect('/regLogin')
        }
    }, []);
    const openChat = (users) => {
        if (users[0] === loggedUser._id) {
            alert('you can not send a message to ur self')
        } else {
            users.push(loggedUser._id)
            setUsersInChat({ 'members': users })
        }
        console.log(users)
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
            <div className='navBar'>
                <Nav />
            </div>
            <div className='underNavCont'>
                <div className='colOne'>
                    <SearchBar useCheckClickOutside={useCheckClickOutside} openChat={openChat} />
                    <MsgNotification />
                </div>
                <div className='colTwo'>
                    {usersInChat === false
                        ?
                        <div className={`mainCont noChatSelected`}>select another user to create a chat</div>
                        :
                        <ChatPanel usersInChatProp={usersInChat} getCurrTime={getCurrTime} />
                    }
                </div>
                <div className='colThree'>
                    <RightPanel />
                </div>
            </div>
        </div>
    )
}

export default HomePage