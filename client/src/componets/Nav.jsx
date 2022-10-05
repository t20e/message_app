import React, { useState, useContext, useEffect } from 'react';
import styles from '../styles/nav.module.css'
import deleteTHisImg from '../imgsOnlyForDev/black-screen.jpeg'
import gearIcon from '../imgsOnlyForDev/gear.png'
import activeUsersIcon from '../imgsOnlyForDev/user.png'
import usersInChatIcon from '../imgsOnlyForDev/group_of_users.png'
import arrowIcon from '../imgsOnlyForDev/arrows.svg'
import { UserContext } from '../context/UserContext'
import axios from 'axios';

const Nav = ({ usersInChatProp }) => {
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
        if (usersInChatProp !== false) {
            console.log(usersInChatProp.members)
            axios.post("http://localhost:8000/api/usersInChat", usersInChatProp.members)
                .then((res) => {
                    console.log(res.data, 'nav')
                    setUsersInChat(res.data)
                    console.log(usersInChat)
                    setRotateArr()
                })
                .catch((error) => console.log(error))
        }

    }, [usersInChatProp]);

    return (
        <div className={styles.navCont}>
            <div className={styles.profileActions}>
                <img src={deleteTHisImg} id={styles.userImg} alt="pfp icon" />
                <div className={styles.otherIcons}>
                    <img src={gearIcon} className={styles.gear} alt="gear icon" />
                    <img src={activeUsersIcon} alt="user profile icon" />
                </div>
            </div>
            <div className={styles.chatInfoCont}>
                <img src={usersInChatIcon} className={styles.chatIcon} alt="users in chat" onClick={showUsersInChat} />
                {usersInChatProp !== false ?
                    <div className={`${styles.usersInChatDiv} ${showUsersDiv}`}>
                        <img src={arrowIcon} className={`${styles.arrBtn} ${rotateArr}`} onClick={showUsersInChat} />
                        <div className={`${styles.userDiv} ${showUsersDiv}`}>
                            {usersInChat.map((user, i) => {
                                return (
                                    <div key={i} className={styles.repeatUser}>
                                        <pre className={styles.active}>•</pre>
                                        <img src={deleteTHisImg} alt="" />
                                        <p>{`${user.firstName}`} {`${user.lastName}`}</p>
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

{/* <div className={styles.repeatUser}>
                                <pre className={styles.active}>•</pre>
                                <img src={deleteTHisImg} alt="" />
                                <p>members</p>
                            </div>
                            <div className={styles.repeatUser}>
                                <pre className={styles.notActive}>•</pre>
                                <img src={deleteTHisImg} alt="" />
                                <p>members</p>
                            </div> */}
export default Nav;