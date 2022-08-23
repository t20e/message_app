import React, { useEffect, useState } from 'react';
import '../styles/message_comp.css'
import axios from 'axios';
import { io } from "socket.io-client"
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';

const ChatPanel = ({ usersInChatProp, loggedUserProp }) => {
    // currentChatId will contain info about chat it will change when users change
    const [usersInChat, setUsersInChat] = useState(usersInChatProp)
    const [currChatId, setCurrChatID] = useState(null)
    const [message, setMessage] = useState({
        'currChat': currChatId,
        'from': '',
        'body': ''
    })
    useEffect(() => {
        message.from = loggedUserProp._id
        setMessage({
            ...message,
        })
    }, [loggedUserProp]);
    const [formErrors, setFormErrors] = useState({})
    const [openDiv, setOpenDiv] = useState(null)

    useEffect(() => {
        // if there isnt then create a new one with the users in chats ids
        if(currChatId === null){
            axios.post('http://127.0.0.1:8000/api/chat/create', usersInChat)
            .then(res =>{
                console.log(res);
            })
            .catch(err=>{
                console.log(err);
            })
        }else{

        }
        // if there already exists pull it 
    }, [usersInChat, currChatId]);
    
    const sendMsg = (e) => {
        e.preventDefault();
        console.log(message);
        axios.post('http://localhost:8000/api/chat/sendMsg', message)
            .then(res => {
                if (res.data.error) {
                    // error sending form
                    console.log('form error');
                } else {
                    setFormErrors({})
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    const growTextarea = (e) => {
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
    // let string = convertUnicode('hi there! 0x1f468 name(params)hi there! are u 0x1f606 well can u function name(params) hi there! are u well can u 0x1f448 function name(params)')
    return (
        <div className='mainCont_c_r'>
            <div className='messages_div'>
                {/* bolderplate to repeat */}
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hello </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' >
                        <p>hi back!(params)  t </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>

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
                        <textarea className="textarea" autoFocus onKeyUp={(e) => growTextarea(e.target)} maxLength={350} name='body' onChange={editInputs} value={convertUnicode(message.body)} placeholder='message...' cols="35" rows="1"></textarea>
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