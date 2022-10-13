import React, { useState } from 'react';

const Register = ({ formSubmission, styles }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({})
    const [renderImg, setRenderimg] = useState('')
    const [renderImgErr, setRenderImgErr] = useState(null)
    const re = new RegExp(
        "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$"
    )
    const register = (e) => {
        e.preventDefault();
        // TO SEND IMGS IN A REACT APP U NEED TO USE THE new FormData();    OBJ;
        // let formData = { firstName, lastName, age, email, password, confirmPassword, profilePic };
        const formData = new FormData();
        formData.append("profilePic", profilePic);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("age", age);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);

        formSubmission(formData, '/api/user/register')
        console.log('registering');
    }
    const showPfp = (e) => {
        if (!re.test(e.target.value)) {
            console.log('not a valid image')
            setRenderImgErr('only jpegs, jpg, png images allowed!')
            setProfilePic('')
            setRenderimg('')
        } else {
            setProfilePic(e.target.files[0]);
            setRenderImgErr(null)
            let img = URL.createObjectURL(e.target.files[0])
            setRenderimg(img)
        }
        console.log(profilePic, renderImg);
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
                <div className={styles.file_age_cont}>
                    <label className={styles.pfpLabel}> upload profile picture
                        <input type="file" className={styles.fileInput} accept="image/*" name="profilePic" onChange={(e) => (showPfp(e))} />
                    </label>
                    <input type="number" className={styles.age} name='age' placeholder='age' onChange={(e) => setAge(e.target.value)} />
                    <p className={styles.formErrors}>{formErrors.age?.message}</p>
                    {
                        renderImgErr !== null ?
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