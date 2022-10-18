import React, { useContext, useEffect } from 'react';
import styles from '../styles/notifications_panel.module.css'
import deleteImg from '../imgsOnlyForDev/black-screen.jpeg'
import { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext'

const MsgNotification = ({ openChat }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [chats, setChats] = useState([])
    useEffect(() => {
        if (loggedUser) {
            // console.log(loggedUser._id)
            if (loggedUser._id) {
                axios.post('http://localhost:8000/api/getAllChatsForUser', { "_id": loggedUser._id })
                    .then(res => {
                        console.log('all chats for user', res.data.results);
                        // setChats([])
                        // let chatData = []
                        // let users = [];
                        // for (const chat of res.data.results) {
                        //     let holder = {}
                        //     holder.chatId = chat._id
                        //     // chatData.push({chatId: chat._id})
                        //     // console.log(chat.messages[chat.messages.length - 1].body)
                        //     holder.msg = chat.messages[chat.messages.length - 1].body
                        //     for (const user in chat.members) {
                        //         if (chat.members[user] !== loggedUser._id) {
                        //             // console.log(chat.members[user])
                        //             holder.userId = chat.members[user]
                        //             users.push(holder.userId)
                        //         }
                        //     }
                        //     chatData.push(holder)
                        // }
                        // // console.log(users)
                        // // U CAN NOT PASS AN ARRAY OF IDS IT HAS TO BE AN OBJECT OR OTHER
                        // let obj = []
                        // users.forEach(user => {
                        //     obj.push({ "_id": user })
                        // })
                        // axios.post('http://localhost:8000/api/usersInChat', obj)
                        //     .then((res) => {
                        //         console.log(res.data, 'users')
                        //         if (res.data.length > 0) {
                        //             res.data.forEach(user => {
                        //                 // console.log(user)
                        //                 chatData.forEach((chat) => {
                        //                     if (chat.userId === user._id) {
                        //                         chat.userName = `${user.firstName} ${user.lastName}`
                        //                         chatData.profilePic = user.profilePic
                                                
                        //                     }
                        //                 })
                        //             })
                        //             // console.log(chatData)
                        //             setChats(chatData)
                        //         }
                        //     })
                        //     .catch((err) => {
                        //         console.log(err, 'err')
                        //     })
                    })
                    .catch(err => {
                        console.log('err getting all chats:', err);
                    })
            }
        }
    }, [loggedUser]);


    return (
        <div className={styles.mainCont}>
            <div className={styles.subMain}>
                {chats.length > 0 ?
                    chats.map((chat, i) => {
                        console.log(chat)
                        return (
                            <div onClick={() => openChat([chat.userId])} key={i} className={styles.msgNotification}>
                                <div className={styles.left}>
                                    <span className={styles.newNotification}></span>
                                    {/* <img className={styles.usersPfp} src={chat.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${chat.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} /> */}
                                </div>
                                <div className={styles.right}>
                                    <h4>{chat.userName}</h4>
                                    <p>{chat.msg}</p>
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