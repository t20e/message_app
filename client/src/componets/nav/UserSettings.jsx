import React, { useState, useRef, useEffect } from 'react';
import styles from "../../styles/userSettings.module.css"
const UserSettings = ({ toggle_popUp, togglePopUpFunc, useCheckClickOutside }) => {
    const [theme, setTheme] = useState()
    const [fontFamily, setFontFamily] = useState()
    const mainCont = useRef(null);
    const [currBgKImg, setCurrBgKImg] = useState()
    const [switchClassTheme, setSwitchClassTheme] = useState({
        "light": undefined,
        "dark": undefined,
        "system": undefined,
    })
    const [switchClassBgk, setSwitchClassBgk] = useState({
        "night_fade": undefined,
        "fluid": undefined,
        "sunny_morning": undefined
    })
    useEffect(() => {
        toggle_popUp ?
            mainCont.current.style.display = 'flex' : mainCont.current.style.display = 'none'
    }, [toggle_popUp]);
    const changeThemeSelected = (theme, e) => {
        setSwitchClassTheme({ [theme]: styles.bg_img })
        setTheme(theme)
        // document.body.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), ${document.body.backgroundImage} `
        console.log(document.body.backgroundImage)
    };
    const changeBgk = (bgk, i) => {
        setSwitchClassBgk({ [bgk]: styles.bg_img })
        if(theme === "dark"){
            document.body.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url(https://portfolio-avis-s3.s3.amazonaws.com/app/images/${i})`
        }else if(theme === "light"){
            document.body.backgroundImage = `url(https://portfolio-avis-s3.s3.amazonaws.com/app/images/${i})`
        }
        // document.body.style.backgroundImage = `url(https://portfolio-avis-s3.s3.amazonaws.com/app/images/${i})`;
        setCurrBgKImg("https://portfolio-avis-s3.s3.amazonaws.com/app/images/${i}")
    }
    // TODO figure out how to call two refs for an element so i can use the useCheckClickOutside
    // let domNode = useCheckClickOutside(() => {
    //     togglePopUpFunc()
    // })
    return (
        <div ref={mainCont} className={styles.PopUpCont}>
            <div className={styles.h1_div}>
                <h2 >Appearance</h2>
            </div>
            <hr />
            <div className={`${styles.radio__cont} ${styles.pad}`}>
                <div>
                    <h4>theme</h4>
                    <p className={styles.p}>select a theme</p>
                </div>
                <div className={styles.radio__div}>
                    <label htmlFor="1">
                        <img className={`${styles.radio__img} ${switchClassTheme.light}`} onClick={(e) => changeThemeSelected("light", e)} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/theme_light.png" />
                        <input type="radio" name="theme_color" id='1' />
                        <p>light</p>
                    </label>
                    <label htmlFor="2">
                        <img className={`${styles.radio__img} ${switchClassTheme.dark}`} onClick={(e) => changeThemeSelected("dark", e)} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/theme_dark.png" />
                        <input type="radio" name="theme_color" id='2' />
                        <p>dark</p>
                    </label>
                    <label htmlFor="3">
                        <img className={`${styles.radio__img} ${switchClassTheme.system}`} onClick={(e) => changeThemeSelected("system", e)} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/theme_system.png" />
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
                        <img className={`${styles.radio__img} ${switchClassBgk.night_fade}`} onClick={(e) => changeBgk("night_fade", "night_fade.png")} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/night_fade.png" />
                        <input type="radio" name="bg_img" id='1' />
                        <p>night fade</p>
                    </label>
                    <label htmlFor="2" >
                        <img className={`${styles.radio__img} ${switchClassBgk.fluid} `} onClick={(e) => changeBgk("fluid", "fluid.jpg")} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/fluid.jpg" />
                        <input type="radio" name="bg_img" id='2' />
                        <p>fluid</p>
                    </label>
                    <label htmlFor="3" >
                        <img className={`${styles.radio__img} ${switchClassBgk.sunny_morning}`} onClick={(e) => changeBgk("sunny_morning", "sunny_mornig.jpg")} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/sunny_mornig.jpg" />
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
                    <select name="font" id={styles.font_select}>
                        <option value="satoshi">satoshi</option>
                        <option value="Ariel">Ariel</option>
                        <option value="peru">peru</option>
                        <option value="demi">demi</option>
                    </select>
                </div>
            </div>
            <hr className={styles.__hrlast} />
            <div className={styles.btnCont}>
                <input type="submit" onClick={togglePopUpFunc} className={`${styles.__btn} ${styles.__color}`} value="Cancel" />
                <input type="submit" className={styles.__btn} value="Save changes" />
            </div>
        </div>
    );
};


export default UserSettings;