import React, { useState, useContext } from 'react';
import styles from '../styles/nav.module.css'
import deleteTHisImg from '../imgsOnlyForDev/black-screen.jpeg'
import gearIcon from '../imgsOnlyForDev/cogwheel.svg'
import activeUsersIcon from '../imgsOnlyForDev/userPfp-01.svg'
import usersInChatIcon from '../imgsOnlyForDev/multipleUsers.svg'
import arrowIcon from '../imgsOnlyForDev/arrows.svg'
import {UserContext} from '../context/UserContext'

const Nav = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    const [showUsers, setShowUsers] = useState('')
    const [rotateArr, setRotateArr] = useState('')
    const showUsersInChat = () => {
        if (showUsers === '') {
            console.log('here');
            setShowUsers(styles.show)
            setRotateArr(styles.rotateArr)
        } else {
            setShowUsers('')
            setRotateArr('')
        }
    }

    return (
        <div className={styles.navCont}>
            <div className={styles.profileActions}>
                <img src={deleteTHisImg} id={styles.userImg} alt="pfp icon" />
                <div className={styles.otherIcons}>
                    <img src={gearIcon} alt="gear icon" />
                    <img src={activeUsersIcon} alt="user profile icon" />
                </div>
            </div>
            <div className={styles.chatInfoCont}>
                <img src={usersInChatIcon} className={styles.chatIcon} alt="users in chat" onClick={showUsersInChat} />

                    <div className={`${styles.showUserInChatDiv} ${showUsers}`}>
                        <img src={arrowIcon} className={`${styles.showUsersInchatArr} ${rotateArr}`} alt="arrow to show users" onClick={showUsersInChat} />
                    </div>
                    <div className={`${styles.usersInChat}  ${showUsers}`}>
                        <div className={styles.repeatUser}>
                            <pre>•</pre>
                            <img src={deleteTHisImg} alt="" />
                            <p>mark</p>
                        </div>
                        <div className={styles.repeatUser}>
                            <pre className={styles.notActive}>•</pre>
                            <img src={deleteTHisImg} alt="" />
                            <p>jackson</p>
                        </div>
                    </div>
            </div>
            <div className={styles.emptySpace}>
                <h1 style={{ color: 'blue'}}>{loggedUser.firstName}</h1>
            </div>
        </div>
    );
};


export default Nav;