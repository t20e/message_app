import React, { useState, useContext, useEffect } from 'react';
import styles from "../../styles/userSettings.module.css"
import { ThemeContext } from "../../context/ThemeContext";

const UserSettings = ({ togglePopUpFunc, useCheckClickOutside }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    // const [font_selected, setFont_selected] = useState(theme.fontFamily)
    const [switchClassTheme, setSwitchClassTheme] = useState({
        light: undefined,
        dark: undefined,
        system: undefined,
    })
    const [switchClassBgk, setSwitchClassBgk] = useState({
        "night_fade": undefined,
        "fluid": undefined,
        "sunny_morning": undefined
    })
    useEffect(() => {
        setSwitchClassTheme({
            [theme.mode]: styles.bg_img
        })
        setSwitchClassBgk({
            [theme.bgk_name] : styles.bg_img
        })
    }, []);
    const changeThemeSelected = (name, e) => {
        setSwitchClassTheme({
            [name]: styles.bg_img
        })
        setTheme({
            ...theme,
            mode: name
        })
    };

    const changeBgk = (name, e) => {
        setSwitchClassBgk({ [name]: styles.bg_img })
        setTheme({
            ...theme,
            bgk_url: e.target.src,
            bgk_name : name
        })
    }
    const changeFont = (e) => {
        setTheme({
            ...theme,
            fontFamily: e.target.value
        })
    }
    let domNode = useCheckClickOutside(() => {
        togglePopUpFunc()
    })
    return (
        <div ref={domNode} className={styles.PopUpCont}>
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
                    <label htmlFor="1">
                        <img className={`${styles.radio__img} ${switchClassBgk.night_fade}`} onClick={(e) => changeBgk("night_fade", e)} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/night_fade.png" alt='select background color' />
                        <input type="radio" name="bg_img" id='1' />
                        <p>night fade</p>
                    </label>
                    <label htmlFor="2" >
                        <img className={`${styles.radio__img} ${switchClassBgk.fluid} `} onClick={(e) => changeBgk("fluid", e)} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/fluid.jpg" alt='select background color' />
                        <input type="radio" name="bg_img" id='2' />
                        <p>fluid</p>
                    </label>
                    <label htmlFor="3" >
                        <img className={`${styles.radio__img} ${switchClassBgk.sunny_morning}`} onClick={(e) => changeBgk("sunny_morning", e)} src="https://portfolio-avis-s3.s3.amazonaws.com/app/images/sunny_mornig.jpg" alt='select background color' />
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
                    <select name="font" defaultValue={theme.fontFamily} onChange={(e) => changeFont(e)} id={styles.font_select}>
                        <option value="Satoshi">Satoshi</option>
                        <option value="Arial">Arial</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Gill Sans">Gill Sans</option>
                    </select>
                </div>
            </div>
            <hr className={styles.__hrlast} />
            <div className={styles.btnCont}>
                <input type="submit" onClick={togglePopUpFunc} className={styles.__btn} value="close" />
            </div>
        </div>
    );
};


export default UserSettings;