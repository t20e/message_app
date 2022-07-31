import React from 'react';
import styles from '../styles/nav.module.css'
import deleteTHisImg from '../imgsOnlyForDev/black-screen.jpeg'
import gearIcon from '../imgsOnlyForDev/cogwheel.svg'
import activeUsersIcon from '../imgsOnlyForDev/userPfp-01.svg'

const Nav = () => {
    return (
        <div>
            <div className={styles.userNav}>
                <img src={deleteTHisImg} className={styles.userPfp} alt="" />
                <div className={styles.navIcons}>
                        <img src={gearIcon} alt="" />
                        <img src={activeUsersIcon} alt="" />
                </div>
            </div>
            <div className={styles.usersInChat__cont}>
                <div className={styles.usersInChat}>
                    {/* //repeat for users in chat */}
                    {/* DONT SHOW THE CURRENT USER HERE */}
                    <div className={styles.userRepeat}>
                        <img src={deleteTHisImg} alt="" />
                        <br/>
                        <p>thomas</p>
                    </div>
                    {/* <div className={styles.userRepeat}>
                        <img src={deleteTHisImg} alt="" />
                        <p>sam</p>
                    </div> */}
                </div>
                      {/* if theres users in the chat then display the text under it  */}
                     {/*  */}
                    {/* <p>users in chat</p> */}
                <div></div>
            </div>
            <div className={styles.empty__space}></div>
        </div>
    );
};


export default Nav;