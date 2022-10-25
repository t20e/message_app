import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles/chat_panel.module.css'
import axios from 'axios';
import Picker from 'emoji-picker-react';
import smileyFace from "../imgsOnlyForDev/smiley_face.svg"
import { UserContext } from '../context/UserContext'
import { SocketContext } from '../context/SocketContext';
import { AllChatsContext } from "../context/AllChatsContext"


const ChatPanel = ({ usersInChatIdProp, useCheckClickOutside, getCurrTime }) => {
    const socket = useContext(SocketContext);
    const { chatsContext, setChatsContext } = useContext(AllChatsContext)
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [currChatId, setCurrChatId] = useState(undefined)
    const [composeMsg, setComposeMsg] = useState({
        'from': loggedUser ? loggedUser._id : null,
        'body': '',
        'timeStamp': null
    })
    const [formErrors, setFormErrors] = useState({})
    const [openDiv, setOpenDiv] = useState(null)
    const scrollBarDiv = useRef(null)
    const textarea = useRef(null)
    const [updateScrollBar, setUpdateScrollBar] = useState(false)
    useEffect(() => {
        // first check db with users in chat for a existing chat, if it doesnt create a new one
        // console.log(usersInChatIdProp)
        if (usersInChatIdProp !== false) {
            axios.post('http://localhost:8000/api/chat', usersInChatIdProp)
                .then(res => {
                    console.log('respond from server, getting or creating chat', res.data);
                    setCurrChatId(res.data.chat._id)
                    if (!chatsContext.allChats[res.data.chat._id]) {
                        // add the whole chat to the allChats context
                        setChatsContext({
                            ...chatsContext,
                            allChats: {
                                ...chatsContext.allChats,
                                [res.data.chat._id]: {
                                    members: res.data.chat.members,
                                    messages: res.data.chat.messages
                                }
                            },
                            currUsersInChat : res.data.chat.members
                        })
                    }
                    setUpdateScrollBar(!updateScrollBar)
                    socket.emit("join_room", res.data.chat._id);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [usersInChatIdProp]);
    // socket io

    useEffect(() => {
        socket.on("res_msg", data => {
            // console.log("new msg", data);
            const { msg, roomId } = data
            let res_msg = { 'from': msg.from, 'body': msg.body, 'timeStamp': msg.timeStamp }
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
            setUpdateScrollBar(!updateScrollBar)
        })
    }, [socket, updateScrollBar])


    const sendMsg = (e) => {
        e.preventDefault();
        if (composeMsg.body === '') {
            setFormErrors({ msg: 'Please enter a message' })
            return;
        }
        let date = getCurrTime()
        composeMsg.timeStamp = date;
        let data = { "msg": composeMsg, "roomId": currChatId }
        socket.emit("new_msg", data);
        setFormErrors({})
        setComposeMsg({
            ...composeMsg,
            body: '',
            date: ''
        })
        textarea.current.style.height = 'inherit';
        textarea.current.style.height = `auto`;
        textarea.current.style.minHeight = `2em`;
    }
    useEffect(() => {
        // console.log(scrollBarDiv.current.scrollHeight)
        scrollBarDiv.current.scrollTop = scrollBarDiv.current.scrollHeight;
    }, [updateScrollBar]);

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
    const convertUnicode = (str) => {
        // console.log(str, 'str')
        if (str.includes('%@')) {
            // console.log('has emoji');
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '%' && str[i + 1] === '@') {
                    // i is the start
                    let end;
                    for (let v = i + 1; v < str.length; v++) {
                        if (str[v] === "$" && str[v - 1] === "#") {
                            end = v + 1
                            break;
                        }
                    }
                    // console.log(str[i], str[end], i, end)
                    let removeSymbols = str.substring(i, end);
                    removeSymbols = removeSymbols.slice(2, removeSymbols.length - 2)
                    // console.log(removeSymbols, 'remove symbols');
                    let emoji = String.fromCodePoint(parseInt(removeSymbols, 16))
                    // console.log(emoji)
                    let newStr = str.slice(0, i - 1) + " " + emoji + " " + str.slice(end);
                    // console.log(newStr)
                    str = newStr
                }
            }
        }
        return str
    }

    const getMsgTime = (time) => {
        // console.log(time)
        if (time !== undefined) {
            let { day, hour, min, month, year } = time
            // console.log(typeof(day), hour, min, month, year);
            let date = getCurrTime()
            if (min === date.min) {
                // sent a min ago
                // FIXME
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
    const twoFunc = (e) => {
        editInputs(e)
        growTextarea(e)
    }
    let domNode = useCheckClickOutside(() => {
        setOpenDiv("")
    })

    return (
        <div className={styles.mainCont}>
            <div ref={scrollBarDiv} className={styles.messages_div}>
                {chatsContext.allChats[currChatId] !== undefined ?
                    chatsContext.allChats[currChatId].messages.length > 0 ?
                        chatsContext.allChats[currChatId].messages.map((i, index) => {
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
            </div>
            <form id={styles.sendMessage_form} onSubmit={sendMsg}>
                <div className={styles.composeMsg_cont}>
                    <div className={styles.composeMsg_actionCont}>
                        <img src={smileyFace} className="imgColorSwitch" alt="smiley face icon" onClick={() => emojiDivController()} />
                        <div ref={domNode} className={`${styles.emoji_picker} ${openDiv}`}>
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    </div>
                    <textarea ref={textarea} id={styles.compose__msg} maxLength={350} name='body' onChange={(e) => twoFunc(e)} value={convertUnicode(composeMsg.body)} placeholder='message...' cols="35" rows="1"></textarea>
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
    )
};


export default ChatPanel;