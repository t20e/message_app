import React from 'react';
import '../styles/message_comp.css'
import deleteImg from '../imgsOnlyForDev/black-screen.jpeg'
import { useState } from 'react';
import axios from 'axios';

const MessageNotification = () => {
    const [msgNotfications, setMsgNotfications] = useState({})

    return (
        <div className='mainCont_n'>
            <div className='subMain'>
                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>
                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n show'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>
                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n show'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n show'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left_n'>
                        <span className='newNotification_n'></span>
                        <img className='usersPfp_n' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right_n'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>




            </div>
        </div>
    );
};

MessageNotification.propTypes = {};

export default MessageNotification;