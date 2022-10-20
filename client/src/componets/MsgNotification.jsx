import React, { useContext, useEffect } from 'react';
import styles from '../styles/notifications_panel.module.css'
import deleteImg from '../imgsOnlyForDev/black-screen.jpeg'
import { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext'

const MsgNotification = ({ openChat, msgCompCurrChat }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [chats, setChats] = useState([])

    useEffect(() => {
        if (loggedUser) {
            if (loggedUser && loggedUser.allChats) {
                axios.post('http://localhost:8000/api/getAllChatsForUser', { chats_data: loggedUser.allChats })
                    .then(res => {
                        console.log('all chats for user', res.data.results);
                        setChats(res.data.results)
                    })
                    .catch(err => {
                        console.log('err getting all chats:', err);
                    })
            }
        }
    }, [loggedUser]);
    useEffect(() => {
        // document.getElementById(msgCompCurrChat).classList.add('currChatSelected')
    }, [msgCompCurrChat])

    return (
        <div className={styles.mainCont}>
            <div className={styles.subMain}>
                {chats.length > 0 ?
                    chats.map((chat, i) => {
                        console.log(chats._id)
                        // console.log(typeof(chat.messages.slice(-1)[0].body))
                        let userOtherThanMain
                        chat.usersData.map((user) => {
                            if (user._id !== loggedUser._id) {
                                userOtherThanMain = user
                            }
                        })
                        return (
                            <div onClick={() => openChat([`${userOtherThanMain._id}`])} key={i} className={`${styles.msgNotification} currChatSelected`} id={`${chat._id}`}>
                                <div className={styles.left}>
                                    <span className={styles.newNotification}></span>
                                    <img className={styles.usersPfp} src={userOtherThanMain.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${userOtherThanMain.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} />
                                </div>
                                <div className={styles.right}>
                                    <h4>{`${userOtherThanMain.firstName} ${userOtherThanMain.lastName}`}</h4>
                                    <p>{chat.messages.length > 0 ? `${chat.messages.slice(-1)[0].body}` : null}</p>
                                </div>
                            </div>
                        )
                    })
                    : null
                }
            </div>
        </div>
    );
};


export default MsgNotification;