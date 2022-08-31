import React, { useEffect, useState, useRef } from 'react';
import '../styles/message_comp.css'
import axios from 'axios';
import Picker from 'emoji-picker-react';
// import io from "socket.io-client"
const { io } = require("socket.io-client");
// const socket = io.connect("http://localhost:8000")

const ChatPanel = ({ usersInChatProp, loggedUserProp, getCurrTime }) => {
    // currentChatId will contain info about chat it will change when users change
    const [currChat, setCurrChat] = useState({})
    const [socket] = useState(io.connect("http://localhost:8000"));
    const [message, setMessage] = useState({
        'from': loggedUserProp._id,
        'body': '',
        'timeStamp': null
    })
    const [formErrors, setFormErrors] = useState({})
    const [openDiv, setOpenDiv] = useState(null)
    useEffect(() => {
        // first check db with users in chat for a existing chat, if it doesnt create a new one
        if (usersInChatProp !== false) {
            axios.post('http://127.0.0.1:8000/api/chat', usersInChatProp)
                .then(res => {
                    console.log('respond from server, getting or creating chat', res.data);
                    setCurrChat(res.data.chat)
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
            console.log(socket.id);
        });
        socket.on("res_msg", data => {
            console.log(data);
            setCurrChat({
                ...currChat,
                messages:  [ ...currChat.messages, { from: data.from, body: data.body, timeStamp: data.timeStamp }]
            })
        })
        // return () => socket.disconnect(true);
    }, [socket]);






    const sendMsg = (e) => {
        e.preventDefault();
        let date = getCurrTime()
        message.timeStamp = date;
        let data = { "message": message, "roomId": currChat._id }
        // TODO add try/catch here
        socket.emit("new_msg", data);
        setMessage({
            ...message,
            body: '',
            date: ''
        })
    }
    // use this to update the above send message
    // const sendMsg = (e) => {
    //     e.preventDefault();
    //     let date = getCurrTime()
    //     message.timeStamp = date;
    //     setMessage({
    //         ...message,
    //     })
    //     let formData = { "message": message, "chatId": currChat._id }
    //     // console.log(formData);
    //     axios.put('http://localhost:8000/api/chat/sendMsg', formData)
    //         .then(res => {
    //             if (res.data.error) {
    //                 // error sending form
    //                 console.log('form error');
    //             } else {
    //                 setMessage({
    //                     ...message,
    //                     body: '',
    //                     date: ''
    //                 })
    //                 setFormErrors({})
    //                 setCurrChat(res.data)
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // }

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
        message.body = message.body + ' 0x' + emojiObject.unified + ' '
        setMessage({
            ...message,
            // body: message.body + ' ' + " "+ emojiObject.emoji
        })
        emojiDivController()
        console.log(message);
    };
    const editInputs = (e) => {
        //*** IF U ARE USING A CHECKBOX OR SOMETHING OTHER THEN TEXT OR # USE AN IF STATEMENTS */
        setMessage({
            ...message,
            [e.target.name]: e.target.value
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

    const callTwoFunc = (e) => { editInputs(e); growTextarea(e.target) }
    return (
        <div className='mainCont_c_r'>
            <div className='messages_div'>
                {Array.isArray(currChat.messages)?
                    currChat.messages.map((msg, i) => {
                        if (msg.from === loggedUserProp._id) {
                            return (
                                <div key={i} className='single_messageDiv--right'>
                                    <div className='message' >
                                        <p>{convertUnicode(msg.body)}</p>
                                    </div>
                                    <p className='dateOf_message'>
                                        {getMsgTime(msg.timeStamp)}
                                    </p>
                                </div>
                            )
                        } else {
                            return (
                                <div key={i} className='single_messageDiv--left'>
                                    <div className='message'>
                                        <p>{convertUnicode(msg.body)}</p>
                                    </div>
                                    <p className='dateOf_message'>
                                        {getMsgTime(msg.timeStamp)}
                                    </p>
                                </div>
                            )
                        }
                    })
                    : <div></div>
                }
            </div>
            <div className='composeMsg_div'>
                <form id='sendMessage_form' onSubmit={sendMsg}>
                    <div className="formCont_one">
                        <p className='emoji_btn' onClick={emojiDivController}>&#128512;</p>
                        <div className={`emoji_picker ${openDiv}`}>
                            <Picker onEmojiClick={onEmojiClick} />
                        </div>
                    </div>
                    <div className="formCont_two">
                        <textarea className="textarea" autoFocus maxLength={350} name='body' onChange={(e) => callTwoFunc(e)} value={convertUnicode(message.body)} placeholder='message...' cols="35" rows="1"></textarea>
                        <p>{ }</p>
                    </div>
                    <div className="formCont_three">
                        {/* add voice input  */}
                        <input type="submit" id='btn' value="" />
                    </div>
                </form>
            </div>
        </div>
    );
};

ChatPanel.propTypes = {};

export default ChatPanel;