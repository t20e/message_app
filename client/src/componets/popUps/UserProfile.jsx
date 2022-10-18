import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from "../../styles/profilePopUp.module.css"
import { UserContext } from '../../context/UserContext';
import deltethisimg from '../../imgsOnlyForDev/arrows.svg';
import axios from 'axios';

const UserProfile = ({openProfilePopUp, useCheckClickOutside}) => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [pfp, setPfp] = useState(loggedUser ? loggedUser.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${loggedUser.profilePic}` : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg" : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg")
    const [imgHover, setImgHover] = useState(false)
    const [openAdressDiv, setOpenAdressDiv] = useState(false)
    const inputFile = useRef(null)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [rotateArrow, setRotateArrow] = useState(false)
    // 
    const [updateUserObj, setUpdateUserObj] = useState({
        firstName: "",
        lastName: "",
        age: "",
        profilePic: "",
        password: "",
        confirmPassword: "",
    })
    const [addressObj, setAddressObj] = useState({
        addressOne: '',
        addressTwo: '',
        postalCode: '',
        city: '',
        state: '',
        country: '',
    })
    const [formErrors, setFormErrors] = useState({})
    const [renderImgErr, setRenderImgErr] = useState()
    const re = new RegExp(
        "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$"
    )
    const updateUser = (e) => {
        e.preventDefault();
        console.log('updating user')
        const formData = new FormData();
        for (let key in updateUserObj) {
            if (updateUserObj[key] !== "") {
                // console.log(key, updateUserObj[key]);
                formData.append(key, updateUserObj[key]);
            }
        }
        if (updateUserObj.profilePic !== "") {
            formData.append("pfpId", loggedUser.profilePic)
        }
        // let addObj = []
        let arrObj = {}
        for (let key in addressObj) {
            if(addressObj[key] !== "") {
                // console.log(addressObj[key])
                arrObj[key] =  addressObj[key];
            }
        }
        formData.append("address", JSON.stringify(arrObj))
        // addObj.push(arrObj);
        // formData.append("addresses", ar );
        // Display the key/value pairs of FormData obj
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        axios.put(`http://localhost:8000/api/users/update/${loggedUser._id}`, formData, {withCredentials: true})
            .then(res => {
                console.log(res.data)
                setLoggedUser(res.data.result)
            })
            .catch(err => console.log(err));
    }
    const showPfp = (e) => {
        if (!re.test(e.target.value)) {
            console.log('not a valid image')
            setRenderImgErr('only jpegs, jpg, png images allowed')
            setUpdateUserObj({
                ...updateUserObj,
                profilePic: ''
            })
            // setPfp('')
        } else {
            setRenderImgErr('')
            let img = URL.createObjectURL(e.target.files[0])
            setPfp(img)
            setUpdateUserObj({
                ...updateUserObj,
                profilePic: e.target.files[0]
            })
        }
    }
    const changeUserObj = (e) => {
        setUpdateUserObj({
            ...updateUserObj,
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'password') {
            setShowConfirmPassword(true)
        }
    }
    const changeAddressObj = (e) => {
        setAddressObj({
            ...addressObj,
            [e.target.name]: e.target.value
        })
    }
    const openFileInput = () => {
        inputFile.current.click();
    }
    let domNode = useCheckClickOutside(() => {
        openProfilePopUp()
    })
    const showAddressDiv = ()=>{
        setOpenAdressDiv(!openAdressDiv)
        setRotateArrow(!rotateArrow)
    }
    return (
        <div ref={domNode} className={styles.content}>
            {loggedUser ?
                <form onSubmit={updateUser}>
                    <div className={styles.pfpCont}>
                        <img id={styles.pfp} src={pfp} onClick={e => openFileInput()} onMouseEnter={() => setImgHover(true)} onMouseOut={() => (setImgHover(false))} alt="user pfp" />
                        <input ref={inputFile} onChange={e => showPfp(e)} type="file" accept="image/*" name="profilePic" style={{ display: 'none' }} />
                        <img className={`${styles.cameraOverPfp} ${imgHover ? styles.show : ''}`} src="https://portfolio-avis-s3.s3.amazonaws.com/app/icons/camera.svg" alt="user pfp" />
                    </div>
                    <div className={styles.inputDiv}>
                        <p>Full name</p>
                        <div className={styles.inputSameLineDiv}>
                            <input className={`${styles.input} ${styles.nameInput}`} type="text" placeholder={loggedUser.firstName} name='firstName' onChange={(e) => changeUserObj(e)} />
                            <input className={`${styles.input} ${styles.nameInput}`} type="text" name='lastName' placeholder={loggedUser.lastName} onChange={(e) => changeUserObj(e)} />
                        </div>
                    </div>
                    <div className={`${styles.inputDiv} ${styles.sameLineInputsDiv}`}>
                        <div className={styles.largerDiv}>
                            <p>Email</p>
                            <input className={`${styles.input} ${styles.emailNotAllowed}`} onClick={() => alert('cant change email')} type="text" readOnly name='email' placeholder={loggedUser.email} />
                        </div>
                        <div className={styles.smallerDiv}>
                            <p>Age</p>
                            <input className={styles.input} type="number" name='age' placeholder={loggedUser.age} onChange={(e) => changeUserObj(e)} />
                        </div>
                    </div>
                    <div className={styles.inputDiv}>
                        <div>
                            <p>Password</p>
                            <input className={styles.input} type="password" name='password' placeholder='********' onChange={(e) => changeUserObj(e)} />
                        </div>
                        <div className={`${styles.confirmPasswordDiv} ${showConfirmPassword ? styles.show : ''}`}>
                            <p>Confirm password</p>
                            <input className={styles.input} type="password" name='confirmPassword' placeholder='confirm password' onChange={(e) => changeUserObj(e)} />
                        </div>
                    </div>
                    <div className={`${styles.inputDiv} ${styles.addressCont}`}>
                        <div>
                            <h4>Address</h4>
                            <img className={`${rotateArrow ? 'rotateArr' : null}  ${'imgColorSwitch'}`} src={deltethisimg} onClick={(e) => showAddressDiv()} alt="" />
                        </div>
                        <div className={`${styles.addressInfoCont} ${openAdressDiv ? styles.show : ''}`}>
                            <div>
                                <p>Address one</p>
                                <input className={styles.input} type="text" name='addressOne' placeholder={loggedUser.address.addressOne ? loggedUser.address.addressOne :'address one'} onChange={(e) => changeAddressObj(e)} />
                            </div>
                            <div>
                                <p>Address two</p>
                                <input className={styles.input} type="text" name='addressTwo' placeholder={loggedUser.address.addressTwo ? loggedUser.address.addressTwo :'address two'} onChange={(e) => changeAddressObj(e)} />
                            </div>
                            <div className={styles.sameLineInputsDiv}>
                                <div className={styles.largerDiv}>
                                    <p>City</p>
                                    <input className={`${styles.input} ${styles.sameLineInput}`} type="text" name='city' placeholder={loggedUser.address.city ? loggedUser.address.city :'city'} onChange={(e) => changeAddressObj(e)} />
                                </div>
                                <div className={styles.smallerDiv}>
                                    <p>Postal code</p>
                                    <input className={`${styles.input} ${styles.sameLineInput}`} type="text" name='postalCode' placeholder={loggedUser.address.postalCode ? loggedUser.address.postalCode :'postal code'} onChange={(e) => changeAddressObj(e)} />
                                </div>
                            </div>
                            <div className={styles.sameLineInputsDiv}>
                                <div className={styles.largerDiv}>
                                    <p>Country</p>
                                    <input className={`${styles.input} ${styles.sameLineInput}`} type="text" name='country' placeholder={loggedUser.address.country ? loggedUser.address.country : 'country'} onChange={(e) => changeAddressObj(e)} />
                                </div>
                                <div className={styles.smallerDiv}>
                                    <p>state</p>
                                    <input className={`${styles.input} ${styles.sameLineInput}`} type="text" name='state' placeholder={loggedUser.address.state ? loggedUser.address.state : 'state' } onChange={(e) => changeAddressObj(e)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <input type="submit" className={`${styles.btn} ${styles.closeBtn}`} onClick={() => openProfilePopUp()} value="close" />
                        <input type="submit" className={styles.btn} value="update" />
                    </div>
                </form>
                : null}
        </div>
    );
};


export default UserProfile;