import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/regLogin_page.module.css'
import axios from 'axios';
import deletethisImg from '../imgsOnlyForDev/black-screen.jpeg'
import Login from './RegLogin/Login';
import Register from './RegLogin/Register';

const RegLogin = () => {
    const redirect = useNavigate();
    // change form
    const [whichForm, setWhichForm] = useState('signUp')

    const formSubmission = (formInfo, url) => {
        console.log(formInfo);
        axios.post(`http://localhost:8000${url}`, formInfo, { withCredentials: true })
            .then(res => {
                console.log("response from server: ", res);
                if (res.data.errors) {
                    // setFormErrors(res.data.errors)
                } else {
                    console.log('success');
                    redirect("/")
                }
            })
            .catch(err => {
                console.log("err registering ", err);
            })
    }

    const toggleBtn = () => {
        if (whichForm == 'signUp') {
            setWhichForm('login')
        } else {
            setWhichForm('signUp')
        }
    }
    
    return (
        <div id={styles.regFormBody}>
            <section className={styles.forms}>
                <div className={styles.formToggle}>
                    <div className={styles.btn1div}>
                        <label htmlFor="">
                            <input type="checkbox" name="" onChange={toggleBtn} id={styles.toggleCheckBox} />
                            <p className={styles.toggleP}>
                                <span className={`${styles.pSpan} ${whichForm == 'signUp' ? styles.p : ''}`}>
                                    Sign Up
                                </span>
                                <span className={`${styles.pSpan} ${whichForm == 'login' ? styles.p : ''}`}>
                                    Log in
                                </span>
                            </p>
                        </label>
                    </div>
                </div>
                <div className={styles.formContainer}>
                    {
                        whichForm == 'signUp' ?
                            <Register formSubmission={formSubmission}/> : <Login formSubmission={formSubmission} />
                    }
                </div>
            </section>
            <aside className={styles.regFormAside}>
                {/* //slanted div */}
                <div className={styles.slantedDiv}>
                    <img className={styles.slantedImg} src={deletethisImg} alt="" />
                </div>
                <div className={styles.titles}>
                    <h1>message app</h1>
                    <p className={styles.titlesP}>the app that keeps the world connected</p>
                </div>
                <i>learn more about us here</i>
            </aside>
        </div>
    );
};


export default RegLogin;