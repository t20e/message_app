import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from '../styles/nav.module.css'
import { UserContext } from '../context/UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AllChatsContext } from "../context/AllChatsContext"
import { ActivityContext } from '../context/ActivityContext'
import Lottie from "lottie-web";
// i could figure out to get the animation from s3 so i left it in the project
import animation from '../miscellaneous/loading_data.json'


const Nav = ({ openProfilePopUp, useCheckClickOutside, openSettingsPopUp }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const { activeUsers, setActiveUsers } = useContext(ActivityContext)
    const { chatsContext, setChatsContext } = useContext(AllChatsContext)
    const [showUsersDiv, setShowUsersDiv] = useState('')
    const [rotateArr, setRotateArr] = useState('')
    const redirect = useNavigate()
    const imgloadRef = useRef()
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
        if (loggedUser) {
            if (!loggedUser.is_bot) {
                if (loggedUser.profilePic == "loadAnimation") {
                    if (imgloadRef.current) {
                        Lottie.loadAnimation({
                            container: imgloadRef.current,
                            renderer: 'svg',
                            loop: true,
                            autoplay: true,
                            animationData: animation
                        })
                    }
                }
            }
        }
    }, [loggedUser]);

    let domNode = useCheckClickOutside(() => {
        setShowUsersDiv("")
    })
    const logout = () => {
        axios.get('http://localhost:8000/chatapp/api/users/logout', { withCredentials: true })
            .then(res => {
                redirect('/chatapp/regLogin')
            })
            .catch(err => {
                console.log(err, 'err logging out')
            })
    }
    return (
        <div className={styles.navCont}>
            <div className={styles.profileActions}>
                {loggedUser ? loggedUser.profilePic === 'loadAnimation' ?
                    <div ref={imgloadRef} id={styles.userImg}></div>
                    :
                    <img src={loggedUser ?
                        loggedUser.is_bot ? loggedUser.profilePic :
                            loggedUser.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${loggedUser.profilePic}`
                                : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"
                        : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} id={styles.userImg} alt="pfp image" />
                    : null}
                <div className={styles.otherIcons}>
                    <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/cogWheel.svg"} onClick={() => openSettingsPopUp()} className={`${styles.gear} ${"imgColorSwitch"}`} alt="gear icon" />
                    <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/user_logo.svg"} onClick={(e) => openProfilePopUp()} className="imgColorSwitch" alt="user profile icon" />
                </div>
            </div>
            <div className={styles.chatInfoCont}>
                <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/many_users_logo.svg"} className={`${styles.chatIcon} ${"imgColorSwitch"}`} alt="users in chat" onClick={showUsersInChat} />
                {chatsContext.currChatId !== undefined ?
                    <div className={`${styles.usersInChatDiv} ${showUsersDiv}`}>
                        <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/arrows.svg"} className={`${styles.arrBtn} ${rotateArr} ${"imgColorSwitch"}`} onClick={showUsersInChat} />
                        <div ref={domNode} className={`${styles.userDiv} ${showUsersDiv}`}>
                            {
                                Object.keys(chatsContext.allChats).length > 0 ?
                                    chatsContext.allChats[chatsContext.currChatId]['members'].map(user => {
                                        // console.log(user)
                                        return (
                                            <div key={user._id} className={styles.repeatUser}>
                                                <p className={`${'bulletAlert'} ${user.is_bot ? 'active' : activeUsers.indexOf(user._id) > -1 ? 'active' : 'notActive'}`}>●</p>
                                                <img src={user ?
                                                    user.is_bot ? user.profilePic :
                                                        user.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${user.profilePic}`
                                                            : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"
                                                    : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} alt="" />
                                                <h4>{user._id === loggedUser._id ? "you" : `${user.firstName} ${user.lastName}`}</h4>
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
                <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/logout.svg"} onClick={() => logout()} className={styles.logoutIcon} alt="" />
            </span>
        </div >
    );
};
export default Nav;