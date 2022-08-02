import React, { useState } from 'react';
import styles from '../../styles/regLogin_page.module.css'


const Login = ({formSubmission}) => {
    let [loginFormEmail, setLoginFormEmail] = useState("");
    let [loginPassword, setLoginPassword] = useState("");
    let [formErrors, setFormErrors] = useState({})

    const login = (e) => {
        e.preventDefault()
        let formInfo = { loginFormEmail, loginPassword };
        formSubmission(formInfo, "/api/user/login")
    }

    return (
        <div>
            <form id={styles.loginForm} onSubmit={login}>
                <input type="text" placeholder='email' name='email' autoFocus onChange={(e) => setLoginFormEmail(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.email?.message}</p>
                <input type="password" name='password' placeholder='password' onChange={(e) => setLoginPassword(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.password?.message}</p>
                <input type="submit" className={styles.submitBtn} value="let's go" />
            </form>
        </div>
    );
};


export default Login;