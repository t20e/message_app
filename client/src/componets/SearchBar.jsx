import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../styles/searchBar_comp.module.css'
import searchIcon from '../imgsOnlyForDev/search_icon.svg'
import deletethisImg from '../imgsOnlyForDev/black-screen.jpeg'
import axios from 'axios'
import {UserContext} from '../context/UserContext'

const SearchBar = ({ useCheckClickOutside, openChat }) => {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [defaultSearchUsers, setDefaultSearchUsers] = useState([]);
    const [searchVal, setSearchVal] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const {loggedUser, setLoggedUser} = useContext(UserContext);

    useEffect(() => {
        axios.get('http://localhost:8000/api/searchAllUsers')
            .then(res => {
                let data = res.data
                // console.log("response from server: ", data);
                // for (let i = 0; i < data.length; i++) {
                //     console.log('i', data[i]._id, loggedUser._id)
                //     if (data[i]._id === loggedUser._id) {
                //         data = data.splice(i, 1)
                //         console.log("deleted");
                //     }
                // }
                setDefaultSearchUsers(data)
            })
            .catch(err => {
                console.log("err getting  users ", err);
            })
    }, []);

    const renderData = () => { }

    const showDefaultSearchUsers = () => {
        if (isOpen === false) {
            setIsOpen(true)
        }
    }
    const searchPeople = (e) => {
        e.preventDefault()
        if (searchVal !== '') {
            axios.get('http://localhost:8000/api/searchUsers', searchVal)
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
        }



        // console.log(e.target.value);
        // // validate the input to stop any special characters
        // let searchItem = e.toLowerCase();
        // if (/\s/g.test(e)) {
        //     console.log(';spaces');
        //     let firstName = e.split(" ")[0].toLowerCase()
        //     let lastName = e.split(" ")[1].toLowerCase()
        //     searchItem = [firstName, lastName]
        //     console.log(firstName, lastName);
        // }


    }
    // close when clicked outside
    let domNode = useCheckClickOutside(() => {
        setIsOpen(false)
    })
    return (
        <div ref={domNode} className={styles.searchBarCont}>
            <form id={styles.searchForm} onSubmit={searchPeople}>
                <input type="text" className={'inputClass'} onClick={showDefaultSearchUsers} onChange={(e) => (searchPeople(e), setSearchVal(e.target.value))} placeholder='search people' />
                <button onClick={searchPeople}>
                    <img src={searchIcon} alt="search icon" />
                </button>
            </form>
            <div className={`${styles.usersSearchDiv} ${isOpen ? styles.show : ''} `}>
                <div className={styles.scrollDiv}>
                    {
                        defaultSearchUsers.map((user, i) => {
                            return (
                                //TODO make it an UL list
                                <div key={i} className={styles.repeatedDiv} onClick={(e) => { openChat([user._id]) }}>
                                    <div className={styles.col1}>
                                        <img src={deletethisImg} alt="search users pfps" />
                                    </div>
                                    <div className={styles.col2}>
                                        <p>{user.firstName} {user.lastName}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};


export default SearchBar;