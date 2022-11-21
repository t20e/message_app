import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles/chat_panel.module.css'
import axios from 'axios';
import Picker from 'emoji-picker-react';
import { UserContext } from '../context/UserContext'
import { AllChatsContext } from "../context/AllChatsContext"
import { ActivityContext } from '../context/ActivityContext'
import { SocketContext, socket } from '../context/SocketContext';

// import { SocketContext, socket } from '../context/SocketContext';
const ChatPanel = ({ usersInChatIdProp, addUserActivity, convertUnicode, useCheckClickOutside, getCurrTime }) => {
    const { chatsContext, setChatsContext } = useContext(AllChatsContext)
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const { activeUsers, setActiveUsers } = useContext(ActivityContext)
    const [composeMsg, setComposeMsg] = useState({
        'from': loggedUser ? loggedUser._id : null,
        'body': '',
        'timeStamp': null
    })
    // chat will holder chat info only about this componet
    const [chat, setChat] = useState({});
    const [formErrors, setFormErrors] = useState(false)
    const [openDiv, setOpenDiv] = useState(null)
    const scrollBarDiv = useRef(null)
    const textarea = useRef(null)
    const [updateScrollBar, setUpdateScrollBar] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    useEffect(() => {
        // first check db with users in chat for a existing chat, if it doesnt create a new one
        // console.log(usersInChatIdProp)
        if (usersInChatIdProp !== false) {
            axios.post('http://localhost:8000/api/chat', usersInChatIdProp)
                .then(res => {
                    console.log('respond from server, getting or creating chat, new Chat: ===> \n', res.data);
                    if (!chatsContext.allChats[res.data.chat._id]) {
                        // add the whole chat to the allChats context
                        console.log('chat not in context')
                        let chatsCopy = chatsContext.allChats
                        chatsCopy[res.data.chat._id] = {
                            members: res.data.chat.members,
                            messages: res.data.chat.messages
                        }
                        setChatsContext({
                            ...chatsContext,
                            allChats: chatsCopy,
                            currChatId: res.data.chat._id
                        })
                        socket.emit('join_room', res.data.chat._id)
                    } else {
                        setChatsContext({
                            ...chatsContext,
                            allChats: {
                                ...chatsContext.allChats,
                                [res.data.chat._id]: {
                                    members: res.data.chat.members,
                                    messages: res.data.chat.messages
                                }
                            },
                            currChatId: res.data.chat._id
                        })
                    }
                    setChat(res.data.chat)
                    setUpdateScrollBar(!updateScrollBar)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [usersInChatIdProp]);
    // socket io
    useEffect(() => {
        socket.on("res_msg", data => {
            console.log('\nrecieving message:', data)
            if (data.err) {
                alert(data.err);
            }
            const { msg, roomId } = data
            let res_msg = { 'from': msg.from, 'body': msg.body, 'timeStamp': msg.timeStamp }
            if (chat._id === roomId) {
                setChat({
                    ...chat,
                    messages: [...chat.messages, res_msg]
                })
            }
            if (chatsContext.allChats[roomId]) {
                setChatsContext({
                    ...chatsContext,
                    allChats: {
                        ...chatsContext.allChats,
                        [roomId]: {
                            ...chatsContext.allChats[roomId],
                            messages: [...chatsContext.allChats[roomId].messages, res_msg]
                        }
                    }
                })
            }
            setUpdateScrollBar(!updateScrollBar)
        })

        socket.on('loadNewChat', newChat => {
            console.log('\n adding chat thats not already loaded ==>', newChat)
            if (newChat.err) {
                alert('please reload page, couldnt find chat, someone is trying to create a new chat with you')
                return
            }
            // add the whole chat to the allChats context
            console.log('chat not in context')
            let chatsCopy = chatsContext.allChats
            chatsCopy[newChat._id] = {
                members: newChat.members,
                messages: newChat.messages
            }
            setChatsContext({
                ...chatsContext,
                allChats: chatsCopy,
            })
            socket.emit('join_room', newChat._id)
        })
        socket.on('res_active_users', (data) => {
            setActiveUsers(data)
            console.log('\nactive users:', activeUsers)
        })
        socket.on('userTyping', (chatId) => {
            if (chatId === chat._id) {
                setIsTyping(true)
                setUpdateScrollBar(!updateScrollBar)
                console.log('received typing, chat id:', chatId)
            }
        })
        socket.on('user_stopped_typing', (chatId) => {
            if (chatId === chat._id) {
                setIsTyping(false)
                console.log('received STOPPED typing, chat id:', chatId)
            }
        })
        // socket.on was repeating many times inside useEffect and the below code also stops the repeating.
        return () => {
            socket.off('loadNewChat');
            socket.off('res_active_users');
            socket.off('res_msg');
            socket.off('userTyping');
            socket.off('user_stopped_typing');
        }
    }, [chatsContext, activeUsers, chat]);

    useEffect(() => {
        // update scrollbar
        if (scrollBarDiv.current) {
            scrollBarDiv.current.scrollTop = scrollBarDiv.current.scrollHeight
        }
    }, [updateScrollBar])
    const sendMsg = (e) => {
        e.preventDefault();
        if (composeMsg.body === '') {
            setFormErrors({ msg: 'Please enter a message' })
            return;
        }
        socket.emit("stopped_typing", chat._id);
        let index;
        chatsContext.allChats[chatsContext.currChatId].members.map((user, i) => {
            if (user._id !== loggedUser._id) {
                index = i;
            }
        })
        let data = {
            "msg": {
                body: composeMsg.body,
                timeStamp: getCurrTime(),
                from: loggedUser._id
            },
            "roomId": chatsContext.currChatId,
            // when the backend gets this userid it will chekck if the user is  a bot then redirect to the chat bot api
            "otherUser": chatsContext.allChats[chatsContext.currChatId].members[index]._id,
            "is_bot": chatsContext.allChats[chatsContext.currChatId].members[index].is_bot ? chatsContext.allChats[chatsContext.currChatId].members[index].is_bot : false
        }
        console.log('sending msg')
        socket.emit("new_msg", data);
        setFormErrors(false)
        setComposeMsg({
            ...composeMsg,
            body: '',
            date: ''
        })
        textarea.current.style.height = 'inherit';
        textarea.current.style.height = `auto`;
        textarea.current.style.minHeight = `2em`;
    }

    const growTextarea = (e) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }
    const emojiDivController = () => {
        openDiv === 'show' ? setOpenDiv("") : setOpenDiv(styles.show)
    }
    const onEmojiClick = (event, emojiObject) => {
        setComposeMsg({
            ...composeMsg,
            body: composeMsg.body + ' %@' + emojiObject.unified + '#$ '
        })
        emojiDivController()
        // console.log(msg.body);
    };
    const editInputs = (e) => {
        setComposeMsg({
            ...composeMsg,
            [e.target.name]: [e.target.value]
        })
    }
    const keyDownHandler = event => {
        if (event.key === 'Enter') {
            console.log('User pressed: ', event.key);
            event.preventDefault();
            sendMsg(event)
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [composeMsg.body]);
    const getMsgTime = (time) => {
        // console.log(time)
        if (time !== undefined) {
            let { day, hour, min, month, year } = time
            // console.log(typeof(day), hour, min, month, year);
            let date = getCurrTime()
            if (min === date.min) {
                // sent a min ago
                return 'a min ago'
            } else if (hour === date.hour) {
                // sent before the last hour pasted
                return `${date.min - min} mins ago`
            } else if (day === date.day && hour !== date.hour) {
                // sent between longer then one hour ago but before one dat ago
                return `${24 - hour} hours ago`
            } else if (day === date.day - 1) {
                // sent yesterday
                return `yesterday`
            } else {
                // sent days ago
                return `${month}-${day} `
            }
        }
    }
    const callMultiFunc = (e) => {
        if (composeMsg.body !== "") {
            console.log('typing', chat._id)
            socket.emit('typing', chat._id)
        }
        editInputs(e)
        growTextarea(e)
        setFormErrors(false)
    }
    let domNode = useCheckClickOutside(() => {
        setOpenDiv("")
    })


    return (
        <span>
            {usersInChatIdProp !== false ?
                <div className={styles.mainCont}>
                    <div ref={scrollBarDiv} className={styles.messages_div}>
                        {chat._id ?
                            chat.messages.length > 0 ?
                                chat.messages.map((i, index) => {
                                    if (i.from === loggedUser._id) {
                                        return (
                                            <div key={index} className={styles.single_messageDiv__right}>
                                                <div className={`${styles.message}`} >
                                                    <p>{convertUnicode(i.body)}</p>
                                                </div>
                                                <p className={styles.dateOf_message}>
                                                    {getMsgTime(i.timeStamp)}
                                                </p>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className={styles.single_messageDiv__left}>
                                                <div className={styles.message}>
                                                    <p>{convertUnicode(i.body)}</p>
                                                </div>
                                                <p className={styles.dateOf_message}>
                                                    {getMsgTime(i.timeStamp)}
                                                </p>
                                            </div>
                                        )
                                    }
                                })
                                : null
                            : null}
                        {
                            isTyping ?
                                <div id='userIsTypingDiv' className={styles.single_messageDiv__left}>
                                    <div className={`${styles.message}`} >
                                        <p>typing...</p>
                                    </div>
                                    <p className={styles.dateOf_message}>
                                    </p>
                                </div>
                                : null
                        }
                    </div>
                    <form id={styles.sendMessage_form} onSubmit={sendMsg}>
                        <div className={styles.composeMsg_cont}>
                            <div className={styles.composeMsg_actionCont}>
                                <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/smiley_face.svg"} className="imgColorSwitch" alt="smiley face icon" onClick={() => emojiDivController()} />
                                <div ref={domNode} className={`${styles.emoji_picker} ${openDiv}`}>
                                    <Picker onEmojiClick={onEmojiClick} />
                                </div>
                            </div>
                            <textarea ref={textarea} id={styles.compose__msg} maxLength={350} name='body' onChange={(e) => callMultiFunc(e)} value={convertUnicode(composeMsg.body)} placeholder='message...' cols="35" rows="1"></textarea>
                            {formErrors.msg ?
                                <div className='errCont upArrErrCont'>
                                    <div className='adjustPos adjustPosUpArr'>
                                        <div className='imgErr'></div>
                                        <p className='err'>
                                            {formErrors.msg}
                                        </p>
                                    </div>
                                </div>
                                : null}
                            <div className={styles.composeMsg_actionCont}>
                                <input type="submit" id={styles.btn} value="" className='imgColorSwitch' />
                            </div>
                        </div>
                    </form>
                </div>
                :
                <div className={styles.mainCont}>
                    <div className={styles.noChatSelected}>Select or search another user to create a chat</div>
                </div>
            }
        </span>
    )
};


export default ChatPanel;