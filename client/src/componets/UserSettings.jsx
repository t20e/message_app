import React, { useState } from 'react';
import styles from "../styles/userSettings.module.css"
import deleteTHisImg from "../imgsOnlyForDev/black-screen.jpeg"
import "../styles/global.css"
const UserSettings = () => {
    const [bg_img, setBg_img] = useState()
    // styles.bg_img
    const changeThemeSelected = (e) => {

    }
    return (
        <div className={styles.PopUpCont}>
            <div className={styles.h1_div}>
                <h2 className={styles.pad}>Appearance</h2>
            </div>
            <hr />
            <div className={`${styles.radio__cont} ${styles.pad}`}>
                <div>
                    <h4>theme</h4>
                    <p className={styles.p}>select a theme</p>
                </div>
                <div className={styles.radio__div}>
                    <label htmlFor="1">
                        <img className={styles.radio__img} src={deleteTHisImg} alt="" />
                        <input type="radio" name="theme_color" id='1' />
                        <p>light</p>
                    </label>
                    <label htmlFor="2">
                        <img className={styles.radio__img} src={deleteTHisImg} alt="" />
                        <input type="radio" name="theme_color" id='2' />
                        <p>dark</p>
                    </label>
                    <label htmlFor="3">
                        <img className={styles.radio__img} src={deleteTHisImg} alt="" />
                        <input type="radio" name="theme_color" id='3' />
                        <p>system preference</p>
                    </label>
                </div>
            </div>
            <hr />
            <div className={`${styles.radio__cont} ${styles.pad}`}>
                <h4>Background</h4>
                <p className={styles.p}>select a background image</p>
                <div className={`${styles.radio__div}`}>
                    <label htmlFor="1" onClick={changeThemeSelected}>
                        <img className={`${styles.radio__img} ${bg_img}`} src={deleteTHisImg} alt="" />
                        <input type="radio" name="bg_img" id='1' />
                        <p>night fade</p>
                    </label>
                    <label htmlFor="2" >
                        <img className={`${styles.radio__img} ${bg_img}`} src={deleteTHisImg} alt="" />
                        <input type="radio" name="bg_img" id='2' />
                        <p>brie</p>
                    </label>
                    <label htmlFor="3" >
                        <img className={`${styles.radio__img} ${bg_img}`} src={deleteTHisImg} alt="" />
                        <input type="radio" name="bg_img" id='3' />
                        <p>sunny morning</p>
                    </label>
                </div>
            </div>
            <hr />
            <div className={`${styles.fontSwitchDiv} ${styles.pad}`}>
                <div>
                    <h4>font</h4>
                    <p className={styles.p}>switch font family</p>
                </div>
                <div>
                    <select name="cars" id="cars">
                        <option value="satoshi">satoshi</option>
                        <option value="Ariel">Ariel</option>
                        <option value="peru">peru</option>
                        <option value="demi">demi</option>
                    </select>
                </div>
            </div>
            <hr className={styles.__hrlast} />
            <div className={styles.btnCont}>
                <input type="submit" className={`${styles.__btn} ${styles.__color}`} value="Cancel" />
                <input type="submit" className={styles.__btn} value="Save changes" />
            </div>
        </div>
    );
};


export default UserSettings;