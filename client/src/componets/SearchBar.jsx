import React, { useState, useEffect } from 'react';
import styles from'../styles/searchBar_comp.module.css'
import searchIcon from '../imgsOnlyForDev/search_icon.svg'
// import { pullData } from '../services/apiConnect'
import deletethisImg from '../imgsOnlyForDev/black-screen.jpeg'
import axios from 'axios'

const SearchBar = () => {
    let [searchedUsers, setSearchedUsers] = useState("");
    let [defaultSearchUsers, setDefaultSearchUsers] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/api/searchAllUsers')
        .then(res => {
            console.log("response from server: ", res);
            setDefaultSearchUsers(res.data)
        })
        .catch(err => {
            console.log("err getting  users ", err);
        })
    }, []);
    const searchPeople = (e) => {
        e.preventDefault()
        // validate the input to stop any special characters
        let searchItem = e.toLowerCase();
        if (/\s/g.test(e)) {
            console.log(';spaces');
            let firstName = e.split(" ")[0].toLowerCase()
            let lastName = e.split(" ")[1].toLowerCase()
            searchItem = [firstName, lastName]
            console.log(firstName, lastName);
        }
        console.log(searchItem);
        // pullData("/api/searchUsers", searchItem).then(results => {
        //     setSearchedUsers(results)
        // }).catch(err => console.log(err))
    }
    // const getDefaultUsersBeforeSearch = () => {
    //     $( '.'+styles.usersSearchDiv).addClass('show');
    //     renderDataOnUi()
    // }
    // console.log($(styles.usersSearchDiv));
    // const renderDataOnUi = () => {
    //     //populate the usersdefaulSearchDiv with this data
    //     $('.'+styles.usersSearchDiv).empty()
    //     for (let i = 0; i < 5; i++) {
    //         $('.'+styles.usersSearchDiv).append(
    //             `<div>
    //                 <img src=${deletethisImg} alt="user pfp" />
    //                 <h6>${defaultSearchUsers[i].firstName} ${defaultSearchUsers[i].lastName}</h6>
    //             </div>`
    //         ).find('div').addClass('.'+ styles.repeatedDiv)
    //     }
    // }
    // $(document).click(function (e) {
    //     if (!$('.searchBarCont').is(e.target) && !$('.searchBarCont').has(e.target).length) {
    //         $('.styles.usersSearchDiv').removeClass('show');
    //     }
    // })
    //if users clicks outside of the usersSearchDiv or the search bar then close that div
    return (
        <div className={styles.searchBarCont}>
            <form id={styles.searchForm}>
                {/* <input type="text" className={styles.searchInput} onClick={getDefaultUsersBeforeSearch} onChange={(e) => (searchPeople(e.target.value))} placeholder='search people' /> */}
                <button onClick={searchPeople}>
                    <img src={searchIcon} alt="search icon" />
                </button>
            </form>
            <div className={styles.usersSearchDiv}>
                {/* // display the people it found */}
            </div>
        </div>
    );
};

SearchBar.propTypes = {};
export default SearchBar;