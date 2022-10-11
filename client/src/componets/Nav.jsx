import React, { useState, useContext, useEffect } from 'react';
import styles from '../styles/nav.module.css'
import deleteTHisImg from '../imgsOnlyForDev/black-screen.jpeg'
import gearIcon from '../imgsOnlyForDev/cogWheel.svg'
import user_icon from '../imgsOnlyForDev/user_logo.svg'
import usersInChatIcon from '../imgsOnlyForDev/many_users_logo.svg'
import arrowIcon from '../imgsOnlyForDev/arrows.svg'
import { UserContext } from '../context/UserContext'
import axios from 'axios';

const Nav = ({ usersInChatProp, togglePopUpFunc }) => {
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
            // console.log(usersInChatProp)
            let obj = []
            usersInChatProp.members.forEach(user => {
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
    }, [usersInChatProp]);


    return (
        <div className={styles.navCont}>
            <div className={styles.profileActions}>
                <img src={deleteTHisImg} id={styles.userImg} alt="pfp icon" />
                <div className={styles.otherIcons}>
                    <img src={gearIcon} onClick={togglePopUpFunc} className={`${styles.gear} ${"imgColorSwitch"}`} alt="gear icon" />
                    <img src={user_icon} className="imgColorSwitch" alt="user profile icon" />
                </div>
            </div>
            <div className={styles.chatInfoCont}>
                <img src={usersInChatIcon} className={`${styles.chatIcon} ${"imgColorSwitch"}`} alt="users in chat" onClick={showUsersInChat} />
                {usersInChatProp !== false ?
                    <div className={`${styles.usersInChatDiv} ${showUsersDiv}`}>
                        <img src={arrowIcon} className={`${styles.arrBtn} ${rotateArr} ${"imgColorSwitch"}`} onClick={showUsersInChat} />
                        <div className={`${styles.userDiv} ${showUsersDiv}`}>
                            {usersInChat.map((user, i) => {
                                return (
                                    <div key={i} className={styles.repeatUser}>
                                        <pre className={styles.active}>•</pre>
                                        <img  src={deleteTHisImg} alt="" />
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