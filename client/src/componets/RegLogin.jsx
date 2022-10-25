import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/regLogin_page.module.css'
import axios from 'axios';
import groupPeopleONlyDev from '../imgsOnlyForDev/groupPeople.jpg'
import Login from './RegLogin/Login';
import Register from './RegLogin/Register';
import { UserContext } from '../context/UserContext'
import GitLink from './GitLink';

const RegLogin = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [formErrors, setFormErrors] = useState({})
    const redirect = useNavigate();
    // change form
    const [whichForm, setWhichForm] = useState('signUp')
    // TODO get form errors and display it on the form
    const formSubmission = (formData, url) => {
        // console.log(formData);
        axios.post(`http://localhost:8000${url}`, formData, { withCredentials: true })
            .then(res => {
                console.log("response from server: ", res);
                if (res.data.err) {
                    // console.log(res.data.errors)
                    setFormErrors(res.data.err.errors)
                } else {
                    console.log('successfully log or reg!', res.userToken);
                    setFormErrors({})
                    localStorage.setItem('userToken', res.userToken);
                    setLoggedUser(res.data.user)
                    localStorage.setItem('_id', res.data.user._id)
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
    const getError = (input) => {
        if (formErrors.hasOwnProperty(input)) {
            return <div className='errCont'>
                <div className='adjustPos'>
                    <div className='imgErr'></div>
                    <p className='err'>
                        {formErrors[input].message}
                    </p>
                </div>
            </div>
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
                            <Register getError={getError}  formSubmission={formSubmission} styles={styles} /> : <Login getError={getError}  styles={styles} formSubmission={formSubmission} />
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
            <GitLink />
        </div>
    );
};


export default RegLogin;