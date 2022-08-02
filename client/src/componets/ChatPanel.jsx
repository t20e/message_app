import React, { useEffect, useState } from 'react';
import '../styles/message_comp.css'
import axios from 'axios';
import { io } from "socket.io-client"

const ChatPanel = ({ usersInChatProp }) => {
    const [usersInChat, setUsersInChat] = useState(usersInChatProp)
    console.log(usersInChat);

    useEffect(() => {
        // check if theres chat already exiting with the ids from main user and others
        // if there isnt then create a new one 
        // if there already exists pull it 
        axios.get('')
        return () => {
            // cleanup
        }
    }, []);
    const growTextarea = (e) => {
        e.style.height = 'inherit';
        e.style.height = `${e.scrollHeight}px`
    }
    return (
        <div className='mainCont_c_r'>
            <div className='messages_div'>
                {/* repeat single message div  */}
                {/* delete all when recieving real messages */}
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--left'>
                    <div className='message'>
                        <p>hi there! are u well can u function name(params)hi there! are u well can u function name(params) hi there! are u well can u function name(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
                <div className='single_messageDiv--right'>
                    <div className='message' style={{ backgroundColor: "deepskyblue" }}>
                        <p>hi back!(params) </p>
                    </div>
                    <p className='dateOf_message'>
                        10-11-12
                    </p>
                </div>
            </div>
            <div className='composeMessage_div'>
                <form id='sendMessage_form'>
                    <div className="formCont_one">
                        <p>&#128512;</p>
                    </div>
                    <div className="formCont_two">
                        <textarea onKeyUp={(e) => growTextarea(e.target)} maxLength={350} className="textarea" placeholder='message...' cols="35" rows="1"></textarea>
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