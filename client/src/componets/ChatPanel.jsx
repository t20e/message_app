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
    const { allChatsState, setAllChatsState } = useContext(AllChatsContext)
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [currChat, setCurrChat] = useState({ _id: null })
    const [messages, setMessages] = useState([])
    const [msg, setMsg] = useState({
        'from': loggedUser ? loggedUser._id : null,
        'body': '',
        'timeStamp': null
    })
    const [formErrors, setFormErrors] = useState({})
    const [openDiv, setOpenDiv] = useState(null)
    const scrollBarDiv = useRef(null)
    const textarea = useRef(null)
    useEffect(() => {
        // first check db with users in chat for a existing chat, if it doesnt create a new one
        // console.log(usersInChatIdProp)
        if (usersInChatIdProp !== false) {
            axios.post('http://localhost:8000/api/chat', usersInChatIdProp)
                .then(res => {
                    console.log('respond from server, getting or creating chat', res.data);
                    setCurrChat({
                        _id: res.data.chat._id,
                    })
                    setMessages(res.data.chat.messages)
                    // console.log('chatId', currChat._id) 
                    setAllChatsState({
                        ...allChatsState,
                        currChat_id: res.data.chat._id,
                        currUsersInChat: res.data.chat.members
                    })
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
            setMessages(current => [...current, { 'from': data.from, 'body': data.body, 'timeStamp': data.timeStamp }])
        })
    }, [socket])

    const sendMsg = (e) => {
        e.preventDefault();
        if (msg.body === '') {
            alert('Please enter a message');
            return
        }
        let date = getCurrTime()
        msg.timeStamp = date;
        let data = { "msg": msg, "roomId": currChat._id }
        socket.emit("new_msg", data);
        let id = currChat._id
        //  TODO check if that id is alrady in the state else rerender the message alert component
        setAllChatsState({
            ...allChatsState,
            allChats: { ...allChatsState.allChats, id: 'hi' }
        })
        setMsg({
            ...msg,
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
    }, [messages]);
    const growTextarea = (e) => {
        // TODO it wont shrink after sending text
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }
    const emojiDivController = () => {
        openDiv === 'show' ? setOpenDiv("") : setOpenDiv(styles.show)
    }
    const onEmojiClick = (event, emojiObject) => {
        setMsg({
            ...msg,
            body: msg.body + ' %@' + emojiObject.unified + '#$ '
        })
        emojiDivController()
        // console.log(msg.body);
    };
    const editInputs = (e) => {
        //*** IF U ARE USING A CHECKBOX OR SOMETHING OTHER THEN TEXT OR # USE AN IF STATEMENTS */
        setMsg({
            ...msg,
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
                return `${hour - 24} hours ago`
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
                {Array.isArray(messages) ?
                    messages.map((i, index) => {
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
                    : <div></div>
                }
            </div>
            <form id={styles.sendMessage_form} onSubmit={sendMsg}>
                <div className={styles.composeMsg_cont}>
                    <div className={styles.composeMsg_actionCont}>
                        <img src={smileyFace} className="imgColorSwitch" alt="smiley face icon" onClick={() => emojiDivController()} />
                        <div ref={domNode} className={`${styles.emoji_picker} ${openDiv}`}>
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    </div>
                    <textarea ref={textarea} id={styles.compose__msg} maxLength={350} name='body' onChange={(e) => twoFunc(e)} value={convertUnicode(msg.body)} placeholder='message...' cols="35" rows="1"></textarea>
                    <div className={styles.composeMsg_actionCont}>
                        <input type="submit" id={styles.btn} value="" className='imgColorSwitch' />
                    </div>
                </div>
            </form>
        </div>
    )
};


ChatPanel.propTypes = {};

export default ChatPanel;