import React, { useContext, useEffect, useState, useRef } from 'react';
import styles from '../styles/notifications_panel.module.css'
import axios from 'axios';
import { UserContext } from '../context/UserContext'
import { AllChatsContext } from "../context/AllChatsContext"
import { SocketContext, socket } from '../context/SocketContext';
import { ActivityContext } from '../context/ActivityContext'

const MsgNotification = ({ openChat, convertUnicode }) => {
    const { activeUsers, setActiveUsers } = useContext(ActivityContext)
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const { chatsContext, setChatsContext } = useContext(AllChatsContext)
    const chatDivs = useRef({})
    const prevChatDiv = useRef(undefined)
    useEffect(() => {
        if (loggedUser) {
            if (loggedUser.allChats.length > 0) {
                axios.get(`http://localhost:8000/api/chatapp/getAllChatsForUser/${loggedUser._id}`)
                    .then(res => {
                        // console.log('all chats for user', res.data.results);
                        let obj = {}
                        let joinMultRooms = []
                        for (let chat in res.data.results) {
                            obj[res.data.results[chat]._id] = { members: res.data.results[chat].members, messages: res.data.results[chat].messages }
                            joinMultRooms.push(res.data.results[chat]._id)
                        }
                        console.log(' rooms to join= >>>>', joinMultRooms)
                        if (joinMultRooms.length > 0) {
                            socket.emit('joinMultRooms', joinMultRooms)
                        }
                        // console.log(obj)
                        setChatsContext({
                            ...chatsContext,
                            allChats: obj
                        })
                    })
                    .catch(err => {
                        console.log('err getting all chats:', err);
                    })
            }
        }
    }, [loggedUser]);


    useEffect(() => {
        if (prevChatDiv.current !== undefined) {
            // prev chat is so i can remove the style
            prevChatDiv.current.setAttribute('id', null)
        }
        // console.log(chatDivs.current)
        if (chatsContext.currChatId !== undefined) {
            for (let id in chatDivs.current) {
                // console.log(id, 'id', 'chatsContext.currChatId:', chatsContext.currChatId)
                if (id === chatsContext.currChatId) {
                    // console.log(id, chatDivs.current[id])
                    prevChatDiv.current = chatDivs.current[id]
                    chatDivs.current[id].setAttribute('id', 'currChatSelected')
                    // id.current.setAttribute('id', 'currChatSelected')
                }
            }
        }
    },[chatsContext.currChatId])

    return (
        <div className={styles.mainCont}>
            <div className={styles.subMain}>
                {
                    Object.keys(chatsContext.allChats).length > 0 ?
                        Object.entries(chatsContext.allChats).map(([key, value]) => {
                            // console.log(key, value);
                            // console.log(typeof(chat.messages.slice(-1)[0].body))
                            let userOtherThanMain
                            value.members.map((user) => {
                                if (user._id !== loggedUser._id) {
                                    userOtherThanMain = user
                                }
                            })
                            // console.log(userOtherThanMain)
                            return (
                                <div className={styles.msgNotification} ref={(e) => chatDivs.current[key] = e} onClick={(e) => openChat([`${userOtherThanMain._id}`])} key={key}>
                                    <div className={styles.left}>
                                        <span className={styles.newNotification}></span>
                                        <p className={`${'bulletAlert'} ${userOtherThanMain.is_bot ? 'active' : activeUsers.indexOf(userOtherThanMain._id) > -1 ? 'active' : 'notActive'}`}>●</p>
                                        <img className={styles.usersPfp} src={userOtherThanMain ?
                                            userOtherThanMain.is_bot ? userOtherThanMain.profilePic :
                                                userOtherThanMain.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${userOtherThanMain.profilePic}`
                                                    : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"
                                            : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} />
                                    </div>
                                    <div className={styles.right}>
                                        <h4>{`${userOtherThanMain.firstName} ${userOtherThanMain.lastName}`}</h4>
                                        <p>{value.messages.length > 0 ? `${convertUnicode(value.messages.slice(-1)[0].body)}` : null}</p>
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