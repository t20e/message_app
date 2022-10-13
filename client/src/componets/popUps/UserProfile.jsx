import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from "../../styles/profilePopUp.module.css"
import { UserContext } from '../../context/UserContext';


const UserProfile = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [pfp, setPfp] = useState(loggedUser ? loggedUser.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${loggedUser.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg" : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg")
    const [imgHover, setImgHover] = useState(false)

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({})
    const [renderImgErr, setRenderImgErr] = useState()
    const re = new RegExp(
        "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$"
    )

    useEffect(() => {
        setPfp(loggedUser ? loggedUser.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${loggedUser.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg" : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg")
    }, [loggedUser]);

    const updateUser = () => {

    }
    const showPfp = (e) => {
        if (!re.test(e.target.value)) {
            console.log('not a valid image')
            setRenderImgErr('only jpegs, jpg, png images allowed')
            setProfilePic('')
            setPfp('')
        } else {
            setRenderImgErr('')
            let img = URL.createObjectURL(e.target.files[0])
            setPfp(img)

        }
    }
    return (
        <div className={styles.content}>
            <form onSubmit={updateUser}>
                <div className={styles.pfpCont}>
                    <img id={styles.pfp} src={pfp} onMouseEnter={() => setImgHover(true)} onMouseOut={() => (setImgHover(false), console.log(imgHover))} alt="user pfp" />
                    <img className={`${styles.cameraOverPfp} ${imgHover ? styles.show : ''}`} src="https://portfolio-avis-s3.s3.amazonaws.com/app/icons/camera.svg" alt="user pfp" />
                </div>
                <div className={styles.inputDiv}>
                    <input type="text" placeholder='first name' name='firstName' onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className={styles.inputDiv}>
                    <input type="text" name='lastName' placeholder='last name' onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className={styles.inputDiv}>
                    <input type="number" className={styles.age} name='age' placeholder='age' onChange={(e) => setAge(e.target.value)} />
                </div>
                <div className={styles.inputDiv}>
                    <input type="text" name='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={styles.inputDiv}>
                    <input type="password" name='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                    {/* TODO when they give a password then it will ask for them to confirm there new password */}
                </div>
                <div className={styles.inputDiv}>
                    <input type="password" name='confirmPassword' placeholder='confirm password' onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                    <input type="submit" className={styles.btn} value="update" />
            </form>
        </div>
    );
};


export default UserProfile;