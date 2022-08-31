import React, { useState } from 'react';


const Login = ({formSubmission, styles}) => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [formErrors, setFormErrors] = useState({})

    const login = (e) => {
        e.preventDefault()
        let formInfo = { email, password };
        formSubmission(formInfo, "/api/user/login")
    }

    return (
        <div>
            <form id={styles.loginForm} onSubmit={login}>
                <input type="text" placeholder='email' name='email' autoFocus onChange={(e) => setEmail(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.email?.message}</p>
                <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.password?.message}</p>
                <input type="submit" className={styles.submitBtn} value="let's go" />
            </form>
        </div>
    );
};


export default Login;