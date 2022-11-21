import React, { useState } from 'react';

const Register = ({ formSubmission, styles, getError }) => {
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        age: "",
        profilePic: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [renderImg, setRenderimg] = useState('')
    const [renderImgErr, setRenderImgErr] = useState(null)
    const re = new RegExp(
        "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$"
    )
    const register = (e) => {
        e.preventDefault();
        // TO SEND IMGS IN A REACT APP U NEED TO USE THE new FormData();    OBJ;
        const formData = new FormData();
        formData.append("profilePic", newUser.profilePic);
        formData.append("firstName", newUser.firstName);
        formData.append("lastName", newUser.lastName);
        formData.append("age", newUser.age);
        formData.append("email", newUser.email);
        formData.append("password", newUser.password);
        formData.append("confirmPassword", newUser.confirmPassword);

        formSubmission(formData, '/api/user/register')
        console.log('registering');
    }
    const showPfp = (e) => {
        if (!re.test(e.target.value)) {
            console.log('not a valid image')
            setRenderImgErr('only jpegs, jpg, png images allowed!')
            setRenderimg('')
            setNewUser({
                ...newUser,
                profilePic: ''
            })
        } else {
            setNewUser({
                ...newUser,
                profilePic: e.target.files[0]
            })
            setRenderImgErr(null)
            let img = URL.createObjectURL(e.target.files[0])
            setRenderimg(img)
        }
        console.log(newUser.profilePic, renderImg);
    }

    const editInputs = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: [e.target.value]
        })
    }
    return (
        <div>
            {renderImg != '' ?
                <img src={renderImg} alt="pfp img" id={styles.showPfp} />
                : ''
            }
            <form id={styles.regForm} onSubmit={register}>
                <input type="text" placeholder='first name' name='firstName' autoFocus onChange={(e) => editInputs(e)} />
                {getError('firstName')}
                <input type="text" name='lastName' placeholder='last name' onChange={(e) => editInputs(e)} />
                {getError('lastName')}
                <div className={styles.file_age_cont}>
                    <label className={styles.pfpLabel}> upload profile picture
                        <input type="file" className={styles.fileInput} accept="image/*" name="profilePic" onChange={(e) => (showPfp(e))} />
                    </label>
                    <input type="number" className={styles.age} name='age' placeholder='age' onChange={(e) => editInputs(e)} />
                    {getError('age')}
                    {
                        renderImgErr !== null ?
                            <p className={styles.imgValP}>{renderImgErr}</p>
                            : ''
                    }
                </div>
                <input type="text" name='email' placeholder='email' onChange={(e) => editInputs(e)} />
                {getError('email')}
                <input type="password" name='password' placeholder='password' onChange={(e) => editInputs(e)} />
                {getError('password')}
                <input type="password" name='confirmPassword' placeholder='confirm password' onChange={(e) => editInputs(e)} />
                {getError('confirmPassword')}
                <input type="submit" className={styles.submitBtn} value="let's go" />
            </form>
        </div>
    );
};


export default Register;