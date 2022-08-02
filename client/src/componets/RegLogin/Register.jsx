import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/regLogin_page.module.css'
import deletethisImg from '../../imgsOnlyForDev/black-screen.jpeg'

const Register = ({formSubmission}) => {
    const redirect = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({})

    const [renderImg, setRenderimg] = useState('')
    const [renderImgErr, setRenderImgErr] = useState()
    const re = new RegExp(
        "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$"
    )
    const register = (e) => {
        e.preventDefault();
        let formInfo = { firstName, lastName, age, email, password, confirmPassword };
        formSubmission(formInfo, '/api/user/register')
    }
    const showPfp = (e) => {
        if (!re.test(e.target.value)) {
            console.log('not a valid image')
            setRenderImgErr('only jpegs, jpg, png images allowed')
            setProfilePic('')
            setRenderimg('')
        } else {
            setRenderImgErr('')
            let img = URL.createObjectURL(e.target.files[0])
            setRenderimg(img)

        }
    }
    return (
        <div>
            {renderImg != '' ?
                <img src={renderImg} alt="pfp img" id={styles.showPfp} />
                : ''
            }
            <form id={styles.regForm} onSubmit={register}>
                <input type="text" placeholder='first name' name='firstName' autoFocus onChange={(e) => setFirstName(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.firstName?.message}</p>
                <input type="text" name='lastName' placeholder='last name' onChange={(e) => setLastName(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.lastName?.message}</p>
                <div >
                    <label className={styles.pfpLabel}> upload profile picture
                        <input type="file" name="profilePic" onChange={(e) => (setProfilePic(e.target.files[0]), showPfp(e))} />
                    </label>
                    <input type="number" className={styles.age} name='age' placeholder='age' onChange={(e) => setAge(e.target.value)} />
                    <p className={styles.formErrors}>{formErrors.age?.message}</p>
                    <p className={styles.imgValP}>{formErrors.pfp?.message}</p>
                    {
                        renderImgErr != '' ?
                            <p className={styles.imgValP}>{renderImgErr}</p>
                            : ''
                    }
                </div>
                <input type="text" name='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.email?.message}</p>

                <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.password?.message}</p>

                <input type="password" name='confirmPassword' placeholder='confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />
                <p className={styles.formErrors}>{formErrors.confirmPassword?.message}</p>

                <input type="submit" className={styles.submitBtn} value="let's go" />
            </form>
        </div>
    );
};


export default Register;