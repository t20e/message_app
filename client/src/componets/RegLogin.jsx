import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/regLogin_page.module.css'
import axios from 'axios';
import groupPeopleONlyDev from '../imgsOnlyForDev/groupPeople.jpg'
import Login from './RegLogin/Login';
import Register from './RegLogin/Register';
import { UserContext } from '../context/UserContext'

const RegLogin = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const redirect = useNavigate();
    // change form
    const [whichForm, setWhichForm] = useState('signUp')
    // TODO get form errors and display it on the form
    const formSubmission = (formData, url) => {
        // console.log(formData);
        axios.post(`http://localhost:8000${url}`, formData, { withCredentials: true })
            .then(res => {
                console.log("response from server: ", res);
                if (res.data.errors) {
                    // setFormErrors(res.data.errors)
                } else {
                    console.log('successfully log or reg!', res.userToken);
                    localStorage.setItem('userToken', res.userToken);
                    setLoggedUser(res.data.user)
                    redirect("/")
                }
            })
            .catch(err => {
                console.log("err authenticating user ", err);
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
        <div id={styles.regFormCon}>
            <section className={styles.formContainer}>
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
                <div className={styles.forms}>
                    {
                        whichForm == 'signUp' ?
                            <Register formSubmission={formSubmission} styles={styles} /> : <Login styles={styles} formSubmission={formSubmission} />
                    }
                </div>
            </section>
            <aside className={styles.regFormAside}>
                <div className={styles.slantedDiv}>
                    <img className={styles.slantedImg} src={groupPeopleONlyDev} alt="" />
                </div>
                <div className={styles.titles}>
                    <h1>Message App</h1>
                    <p className={styles.titlesP}>the app that keeps the world connected</p>
                </div>
                <i>learn more about us here</i>
            </aside>
        </div>
    );
};


export default RegLogin;