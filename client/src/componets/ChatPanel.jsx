import React, { useEffect, useState, useRef, useContext } from 'react';
import '../styles/message_comp.css'
import axios from 'axios';
import Picker from 'emoji-picker-react';
import smileyFace from "../imgsOnlyForDev/smiley_face.png"
import { UserContext } from '../context/UserContext'
import { SocketContext } from '../context/SocketContext';

const ChatPanel = ({ usersInChatProp, getCurrTime }) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const socket = useContext(SocketContext);
    // currentChatId will contain info about chat it will change when users change
    const [currChat, setCurrChat] = useState({ _id: null })
    const [messages, setMessages] = useState([])
    const [msg, setMsg] = useState({
        'from': loggedUser._id,
        'body': '',
        'timeStamp': null
    })
    const [formErrors, setFormErrors] = useState({})
    const [openDiv, setOpenDiv] = useState(null)
    useEffect(() => {
        // first check db with users in chat for a existing chat, if it doesnt create a new one
        if (usersInChatProp !== false) {
            axios.post('http://localhost:8000/api/chat', usersInChatProp)
                .then(res => {
                    console.log('respond from server, getting or creating chat', res.data);
                    setCurrChat({
                        _id: res.data.chat._id,
                    })
                    setMessages(res.data.chat.messages)
                    // console.log('chatId', currChat._id) 
                    socket.emit("join_room", res.data.chat._id);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [usersInChatProp]);

    // socket io
    useEffect(() => {
        socket.on("connect", () => {
            // console.log("socket_id: ", socket.id);
        });
        socket.on("res_msg", data => {
            console.log("new msg", data);
            setMessages(current => [...current, { 'from': data.from, 'body': data.body, 'timeStamp': data.timeStamp }])
        })
        return () => socket.disconnect(true);
    }, [socket]);



    const sendMsg = (e) => {
        e.preventDefault();
        let date = getCurrTime()
        msg.timeStamp = date;
        let data = { "body": msg, "roomId": currChat._id }
        socket.emit("new_msg", data);
        setMsg({
            ...msg,
            body: '',
            date: ''
        })
    }
    const growTextarea = (e) => {
        // TODO it wont shrink after sending text
        e.style.height = 'inherit';
        e.style.height = `${e.scrollHeight}px`
    }
    const emojiDivController = () => {
        openDiv === 'open' ? setOpenDiv(null) : setOpenDiv('open')
    }
    const onEmojiClick = (event, emojiObject) => {
        // console.log(emojiObject);
        msg.body = msg.body + ' 0x' + emojiObject.unified + ' '
        setMsg({
            ...msg,
            // body: message.body + ' ' + " "+ emojiObject.emoji
        })
        emojiDivController()
        console.log(msg);
    };
    const editInputs = (e) => {
        //*** IF U ARE USING A CHECKBOX OR SOMETHING OTHER THEN TEXT OR # USE AN IF STATEMENTS */
        setMsg({
            ...msg,
            [e.target.name]: [e.target.value]
        })
    }
    const convertUnicode = (str) => {
        if (str.includes('0x')) {
            // console.log('has emoji');
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '0' && str[i + 1] === 'x' && str[i - 1] === ' ') {
                    // i is the start of the slice
                    let end;
                    for (let k = i; k < str.length; k++) {
                        if (str[k] === " ") {
                            end = k
                            break;
                        }
                    }
                    // console.log(i, end);
                    let emoji = String.fromCodePoint(str.slice(i, end))
                    // console.log(emoji);
                    let newStr = str.slice(0, i) + emoji + str.slice(end)
                    // console.log(newStr);
                    str = newStr
                }
            }
        }
        // console.log(str);
        return str
    }

    console.log('reloading comp');

    const getMsgTime = (time) => {
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
    const twoFunc = (e) => {
        editInputs(e)
        growTextarea(e)
    }
    return (
        <div className='mainCont'>
            <div className='messages_div'>
                {Array.isArray(messages) ?
                    messages.map((i, index) => {
                        if (i.from === loggedUser._id) {
                            return (
                                <div key={index} className='single_messageDiv--right'>
                                    <div className='message' >
                                        <p>{convertUnicode(i.body)}</p>
                                    </div>
                                    <p className='dateOf_message'>
                                        {getMsgTime(i.timeStamp)}
                                    </p>
                                </div>
                            )
                        } else {
                            return (
                                <div key={index} className='single_messageDiv--left'>
                                    <div className='message'>
                                        <p>{convertUnicode(i.body)}</p>
                                    </div>
                                    <p className='dateOf_message'>
                                        {getMsgTime(i.timeStamp)}
                                    </p>
                                </div>
                            )
                        }
                    })
                    : <div></div>
                }
            </div>
            <form id='sendMessage_form' onSubmit={sendMsg}>
                <div className='composeMsg_cont'>
                    <div className='composeMsg_actionCont'>
                        <img src={smileyFace} className="emoji_btn_toggle" alt="smiley face" onClick={emojiDivController} />
                        <div className={`emoji_picker ${openDiv}`}>
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    </div>
                    <textarea id='compose__msg' autoFocus maxLength={350} name='body' onChange={(e) => twoFunc(e)} value={convertUnicode(msg.body)} placeholder='message...' cols="35" rows="1"></textarea>

                    {/* <contentEditable id='compose__msg' onChange={(e) => editInputs(e)}  ></contentEditable> */}
                    {/* <div id='compose__msg' name='body'  onInput={(e) => editInputs(e)} value={convertUnicode(message.body)} placeholder='message...' contentEditable></div> */}
                    {/* <textarea className="textarea" autoFocus contentEditable maxLength={350} name='body' onChange={(e) => editInputs(e)} value={convertUnicode(message.body)} placeholder='message...' cols="35" rows="1"></textarea> */}
                    <div className='composeMsg_actionCont'>
                        <input type="submit" id='btn' value="" />
                    </div>
                </div>
            </form>
        </div>
    );
};


ChatPanel.propTypes = {};

export default ChatPanel;