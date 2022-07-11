import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import '../styles/index.css'
import deletethisImg from '../imgsOnlyForDev/black-screen.jpeg'
import $ from 'jquery';

const RegLoginComp = () => {
    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [age, setAge] = useState("");
    // let [profilePic, setProfilePic] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");

    //login form
    let [loginFormEmail, setLoginFormEmail] = useState("");
    let [loginPassword, setLoginPassword] = useState("");

    let [formErrors, setFormErrors] = useState({})
    const redirect = useNavigate();

    const register = (e) => {
        e.preventDefault();
        let formInfo = { firstName, lastName, age, email, password, confirmPassword };
        formSubmission(formInfo, '/api/user/register')
    }
    const login = (e) => {
        e.preventDefault()
        let formInfo = { loginFormEmail, loginPassword };
        formSubmission(formInfo, "/api/user/login")
    }
    const formSubmission = (formInfo, url) => {
        axios.post(`http://localhost:8000${url}`, formInfo, { withCredentials: true })
            .then(res => {
                console.log("response from server: ", res);
                if (res.data.errors) {
                    setFormErrors(res.data.errors)
                } else {
                    console.log('success');
                    redirect("/")
                }
            })
            .catch(err => {
                console.log("err registering ", err);
            })
    }

    const showPfp = (e) => {
        // isMember ? '$2.00' : '$10.00'
        //validate if the file ends with .png .jpeg or .jpg
        const reader = new FileReader()
        reader.onload = () => {
            $('#showPfp').addClass('show').attr('src', reader.result)
            $('.pfpLabel').addClass('remove')
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const toggleBtn = () => {
        setFormErrors({})
        if (document.getElementById('toggleCheckBox').checked) {
            $('.loginSpan').addClass('show')
            $('.regSpan').addClass('remove')
            //cahnge to a form for login
            $('#loginForm').addClass('show')
            $('#regForm').addClass('remove')
            //also erase the uploaded img if they uploaded it
            $('#showPfp').attr('src', '').removeClass('show')
            $('.pfpLabel').addClass('remove')
        } else {
            $('.pfpLabel').removeClass('remove')
            $('.regSpan').removeClass('remove')
            $('#loginForm').removeClass('show')
            $('#regForm').removeClass('remove')
        }
    }

    return (
        <div id='regFormBody'>
            <section className='forms'>
                <div className="formToggle">

                    <div className="btn1div">
                        <label htmlFor="">
                            <input type="checkbox" name="" onChange={toggleBtn} id="toggleCheckBox" />
                            <p className='toggleP'>
                                <span className='regSpan'>
                                    Sign Up
                                </span>
                                <span className="loginSpan">
                                    Log in
                                </span>
                            </p>
                        </label>
                    </div>
                </div>
                <div className='formContainer'>
                    <img src="" alt="pfp img" id='showPfp' />
                    <form id='regForm' onSubmit={register}>
                        <input type="text" placeholder='first name' name='firstName' autoFocus onChange={(e) => setFirstName(e.target.value)} />
                        <p className='formErrors'>{formErrors.firstName?.message}</p>
                        <input type="text" name='lastName' placeholder='last name' onChange={(e) => setLastName(e.target.value)} />
                        <p className='formErrors'>{formErrors.lastName?.message}</p>
                        <div >
                            <label className="pfpLabel"> upload profile picture
                                {/* <input type="file" name="profilePic" onChange={(e) => (setProfilePic(e.target.value), showPfp(e))} /> */}
                            </label>
                            <input type="number" className='age' name='age' placeholder='age' onChange={(e) => setAge(e.target.value)} />
                            <p className='formErrors'>{formErrors.age?.message}</p>
                        </div>
                        <input type="text" name='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                        <p className='formErrors'>{formErrors.email?.message}</p>

                        <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                        <p className='formErrors'>{formErrors.password?.message}</p>

                        <input type="password" name='confirmPassword' placeholder='confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />
                        <p className='formErrors'>{formErrors.confirmPassword?.message}</p>

                        <input type="submit" className='submitBtn' value="let's go" />
                    </form>
                    <form id='loginForm' onSubmit={login}>
                        <input type="text" placeholder='email' name='email' autoFocus onChange={(e) => setLoginFormEmail(e.target.value)} />
                        <p className='formErrors'>{formErrors.email?.message}</p>
                        <input type="password" name='password' placeholder='password' onChange={(e) => setLoginPassword(e.target.value)} />
                        <p className='formErrors'>{formErrors.password?.message}</p>
                        <input type="submit" className='submitBtn' value="let's go" />

                    </form>
                </div>
            </section>
            <aside className='regFormAside'>
                {/* //slanted div */}
                <div className='slantedDiv'>
                    <img className='slantedImg' src={deletethisImg} alt="" />
                </div>
                <div className='titles'>
                    <h1>message app</h1>
                    <p className='titlesP'>the app that keeps the world connected</p>
                </div>
                <i>learn more about us here</i>
            </aside>
        </div>
    );
};
export default RegLoginComp;