import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from '../styles/nav.module.css'
import deleteTHisImg from '../imgsOnlyForDev/black-screen.jpeg'
import gearIcon from '../imgsOnlyForDev/cogWheel.svg'
import user_icon from '../imgsOnlyForDev/user_logo.svg'
import usersInChatIcon from '../imgsOnlyForDev/many_users_logo.svg'
import arrowIcon from '../imgsOnlyForDev/arrows.svg'
import { UserContext } from '../context/UserContext'
import axios from 'axios';

const Nav = ({ usersInChatIdProp, openProfilePopUp,useCheckClickOutside, openSettingsPopUp }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [usersInChat, setUsersInChat] = useState([])
    const [showUsersDiv, setShowUsersDiv] = useState('')
    const [rotateArr, setRotateArr] = useState('')

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
        if (usersInChatIdProp !== false) {
            // console.log(usersInChatIdProp)
            let obj = []
            usersInChatIdProp.members.forEach(user => {
                obj.push({ "_id": user });
            })
            axios.post("http://localhost:8000/api/usersInChat", obj)
                .then((res) => {
                    console.log(res.data, 'nav')
                    setUsersInChat(res.data)
                    setRotateArr()
                })
                .catch((error) => console.log(error))
        }
    }, [usersInChatIdProp]);

    useEffect(() => {
        // console.log(loggedUser)
    }, [loggedUser]);
    let domNode = useCheckClickOutside(() => {
        setShowUsersDiv("")
    })
    return (
        <div className={styles.navCont}>
            <div className={styles.profileActions}>
                <img src={loggedUser ? loggedUser.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${loggedUser.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg" : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} id={styles.userImg} alt="pfp icon" />
                <div className={styles.otherIcons}>
                    <img src={gearIcon} onClick={() => openSettingsPopUp()} className={`${styles.gear} ${"imgColorSwitch"}`} alt="gear icon" />
                    <img src={user_icon} onClick={(e) => openProfilePopUp()} className="imgColorSwitch" alt="user profile icon" />
                </div>
            </div>
            <div className={styles.chatInfoCont}>
                <img src={usersInChatIcon} className={`${styles.chatIcon} ${"imgColorSwitch"}`} alt="users in chat" onClick={showUsersInChat} />
                {usersInChatIdProp !== false ?
                    <div className={`${styles.usersInChatDiv} ${showUsersDiv}`}>
                        <img src={arrowIcon} className={`${styles.arrBtn} ${rotateArr} ${"imgColorSwitch"}`} onClick={showUsersInChat} />
                        <div ref={domNode} className={`${styles.userDiv} ${showUsersDiv}`}>
                            {usersInChat.map((user, i) => {
                                return (
                                    <div key={i} className={styles.repeatUser}>
                                        <pre className={user.isActive ? styles.active : styles.notActive }>•</pre>
                                        <img src={user.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${user.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"}  alt="" />
                                        <h4>{`${user.firstName}`} {`${user.lastName}`}</h4>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    : null}
            </div>
        </div>
    );
};
export default Nav;