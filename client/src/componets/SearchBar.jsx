import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../styles/searchBar_comp.module.css'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import { ActivityContext } from '../context/ActivityContext'

const SearchBar = ({ useCheckClickOutside, openChat }) => {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [searchErr, setSearchErr] = useState();
    const { activeUsers, setActiveUsers } = useContext(ActivityContext)

    const showDiv = () => {
        if (isOpen === false) {
            setIsOpen(true)
        }
    }
    const searchPeople = (e) => {
        e.preventDefault()
        axios.get(`http://localhost:8000/chatapp/api/searchUsers/${e.target.value}`)
            .then(res => {
                // console.log(res.data);
                setSearchedUsers(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    // close when clicked outside
    let domNode = useCheckClickOutside(() => {
        setIsOpen(false)
    })
    return (
        <div ref={domNode} className={styles.searchBarCont}>
            <form id={styles.searchForm}>
                <input type="text" className={styles.input} onClick={() => showDiv()} onChange={(e) => (searchPeople(e))} placeholder='search people' />
                <img src={"https://portfolio-avis-s3.s3.amazonaws.com/app/icons/search_icon.svg"} className="imgColorSwitch" alt="search icon" />
            </form>
            <div className={`${styles.usersSearchDiv} ${isOpen ? styles.show : ''} `}>
                <div className={styles.scrollDiv}>
                    {searchErr ?
                        <p className='err'>{searchErr}</p> : null}
                    {
                        searchedUsers.map((user, i) => {
                            if (user._id === loggedUser._id) {
                                return null
                            } else {
                                return (
                                    <div key={i} className={styles.repeatedDiv} onClick={(e) => { openChat([user._id]) }}>
                                        <p className={user.is_bot ? 'active' :  activeUsers.indexOf(user._id) > -1 ? 'active' : 'notActive'}>●</p>
                                        <div className={styles.col1}>

                                            <img src={user ?
                                                user.is_bot ? user.profilePic :
                                                    user.profilePic.length === 32 ? `https://portfolio-avis-s3.s3.amazonaws.com/client/message-app/${user.profilePic}`
                                                        : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"
                                                : "https://portfolio-avis-s3.s3.amazonaws.com/app/icons/noPfp.svg"} alt="searched users pfps" />
                                        </div>
                                        <div className={styles.col2}>
                                            <p>{user.firstName} {user.lastName}</p>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    );
};


export default SearchBar;