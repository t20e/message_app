import React from 'react'
import MessageNotification from './MessageNotification'
import SearchBar from './SearchBar'
import Chat_panel from './Chat_panel'
import Right_panel from './Right_panel'
import Nav from './Nav'
import '../styles/global.css'
import '../styles/home_page.css'

const HomePage = () => {


    return (
        <div id='mainPageDiv'>
            <div className='navDiv'>
                <Nav/>
            </div>
            <div className='underNavCont'>
                <div className='colOne'>
                        <SearchBar />
                        <MessageNotification />
                </div>
                <div className='colTwo'>
                    <Chat_panel />
                </div>
                <div className='colThree'>
                    <Right_panel/>
                </div>
            </div>
        </div>
    )
}

export default HomePage