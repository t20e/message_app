import React, { useContext, useEffect, useRef } from 'react';
import styles from '../styles/notifications_panel.module.css'
import deleteImg from '../imgsOnlyForDev/black-screen.jpeg'
import { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext'
import { AllChatsContext } from "../context/AllChatsContext"
import { set } from 'mongoose';

const MsgNotification = ({ openChat }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const { allChatsState, setAllChatsState } = useContext(AllChatsContext)
    const [chats, setChats] = useState([])
    const chatDivs = useRef({})
    const prevChatDiv = useRef(undefined)
    useEffect(() => {
        if (loggedUser) {
            if (loggedUser && loggedUser.allChats) {
                axios.post('http://localhost:8000/api/getAllChatsForUser', { chats_data: loggedUser.allChats })
                    .then(res => {
                        // console.log('all chats for user', res.data.results);
                        setChats(res.data.results)
                        console.log(res.data.results)
                        let obj = {}
                        for(let chat in res.data.results){
                            obj[res.data.results[chat]._id] = {members : res.data.results[chat].usersData, messages: res.data.results[chat].messages}
                        }
                        setAllChatsState({
                            ...allChatsState,
                            allChats : obj
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
            prevChatDiv.current.setAttribute('id', null)
        }
        if (allChatsState.currChat_id) {
            for (let id in chatDivs.current) {
                if (id === allChatsState.currChat_id) {
                    // console.log(id, chatDivs.current[id])
                    prevChatDiv.current = chatDivs.current[id]
                    chatDivs.current[id].setAttribute('id', 'currChatSelected')
                    // id.current.setAttribute('id', 'currChatSelected')
                }
            }
        }
    }, [allChatsState])

    return (
        <div className={styles.mainCont}>
            <div className={styles.subMain}>
                {chats.length > 0 ?
                    chats.map((chat, i) => {
                        // console.log(typeof(chat.messages.slice(-1)[0].body))
                        let userOtherThanMain
                        chat.usersData.map((user) => {
                            if (user._id !== loggedUser._id) {
                                userOtherThanMain = user
                            }
                        })
                        return (
                            <div ref={(e) => chatDivs.current[chat._id] = e} onClick={() => openChat([`${userOtherThanMain._id}`])} key={i} className={styles.msgNotification} >
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