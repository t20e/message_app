import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from '../styles/nav.module.css'
import gearIcon from '../imgsOnlyForDev/cogWheel.svg'
import user_icon from '../imgsOnlyForDev/user_logo.svg'
import usersInChatIcon from '../imgsOnlyForDev/many_users_logo.svg'
import arrowIcon from '../imgsOnlyForDev/arrows.svg'
import { UserContext } from '../context/UserContext'
import axios from 'axios';
import logoutIcon from '../imgsOnlyForDev/logout.svg'
import { useNavigate } from 'react-router-dom';
import { AllChatsContext } from "../context/AllChatsContext"


const Nav = ({ openProfilePopUp, useCheckClickOutside, openSettingsPopUp }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const { chatsContext, setChatsContext } = useContext(AllChatsContext)
    const [showUsersDiv, setShowUsersDiv] = useState('')
    const [rotateArr, setRotateArr] = useState('')
    const redirect = useNavigate()
    const showUsersInChat = () => {
        if (showUsersDiv === '') {
            setShowUsersDiv(styles.show)
            setRotateArr(styles.rotateArr)
        } else {
            setShowUsersDiv('')
            setRotateArr('')
        }
    }

    useEffect(() => {
        // console.log(loggedUser)
    }, [loggedUser]);
    let domNode = useCheckClickOutside(() => {
        setShowUsersDiv("")
    })
    const logout = () => {
        axios.get('http://localhost:8000/api/users/logout', { withCredentials: true })
            .then(res => {
                redirect('/regLogin')
            })
            .catch(err => {
                console.log(err, 'err logging out')
            })
    }
    return (
        <div className={styles.navCont}>
            <div className={styles.profileActions}>
                <img src={loggedUser ?
                    loggedUser.is_bot ? loggedUser.profilePic :
                        loggedUser.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${loggedUser.profilePic}`
                            : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"
                    : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} id={styles.userImg} alt="pfp image" />
                <div className={styles.otherIcons}>
                    <img src={gearIcon} onClick={() => openSettingsPopUp()} className={`${styles.gear} ${"imgColorSwitch"}`} alt="gear icon" />
                    <img src={user_icon} onClick={(e) => openProfilePopUp()} className="imgColorSwitch" alt="user profile icon" />
                </div>
            </div>
            <div className={styles.chatInfoCont}>
                <img src={usersInChatIcon} className={`${styles.chatIcon} ${"imgColorSwitch"}`} alt="users in chat" onClick={showUsersInChat} />
                {chatsContext.currChatId !== undefined ?
                    <div className={`${styles.usersInChatDiv} ${showUsersDiv}`}>
                        <img src={arrowIcon} className={`${styles.arrBtn} ${rotateArr} ${"imgColorSwitch"}`} onClick={showUsersInChat} />
                        <div ref={domNode} className={`${styles.userDiv} ${showUsersDiv}`}>
                            {
                                Object.keys(chatsContext.allChats).length > 0 ?
                                    chatsContext.allChats[chatsContext.currChatId]['members'].map(user => {
                                        // console.log(user)
                                        return (
                                            <div key={user._id} className={styles.repeatUser}>
                                                <pre className={user.isActive ? styles.active : styles.notActive}>•</pre>
                                                <img src={user ?
                                                    user.is_bot ? user.profilePic :
                                                        user.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${user.profilePic}`
                                                            : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"
                                                    : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} alt="" />
                                                <h4>{user._id === user._id ? "you" : `${user.firstName} ${user.lastName}`}</h4>
                                            </div>
                                        )
                                    })
                                    : null
                            }
                        </div>
                    </div>
                    : null}
            </div>
            <span className={`${styles.logoutSpan} ${'imgColorSwitch'}`}>
                <img src={logoutIcon} onClick={() => logout()} className={styles.logoutIcon} alt="" />
            </span>
        </div >
    );
};
export default Nav;