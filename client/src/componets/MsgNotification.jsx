import React from 'react';
import '../styles/notifications_panel.css'
import deleteImg from '../imgsOnlyForDev/black-screen.jpeg'
import { useState } from 'react';
import axios from 'axios';

const MsgNotification = () => {
    const [msgNotifications, setMsgNotifications] = useState({})

    return (
        <div className='mainCont'>
            <div className='subMain'>
                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>
                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification show'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>
                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification show'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification show'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>

                <div className="msgNotification">
                    <div className='left'>
                        <span className='newNotification'></span>
                        <img className='usersPfp' src={deleteImg} alt="others users profile picture" />
                    </div>
                    <div className='right'>
                        <h4>tom</h4>
                        <p>hi ther berry are u alright</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

MsgNotification.propTypes = {};

export default MsgNotification;