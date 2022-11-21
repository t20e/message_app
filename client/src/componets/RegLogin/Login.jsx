import React, { useState } from 'react';


const Login = ({formSubmission, styles, getError}) => {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    const login = (e) => {
        e.preventDefault()
        let formInfo = { email, password };
        formSubmission(formInfo, "/api/user/login")
    }

    return (
        <div>
            <form id={styles.loginForm} onSubmit={login}>
                <input type="text" placeholder='email' name='email' autoFocus onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                {getError('loginFail')}
                <input type="submit" className={styles.submitBtn} value="let's go" />
            </form>
        </div>
    );
};


export default Login;