import React, {useState, useEffect} from 'react';
import clsx from "clsx";
import {Link} from 'react-router-dom'

import {AiOutlineMenu} from 'react-icons/ai'
import './Toolbar.scss';

const Toolbar = (props) => {


    const [isSticky2, setIsSticky2] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.pageYOffset;
      setIsSticky2(scrollHeight > 20 ? true : false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={clsx("mobile-toolbar", isSticky2 ? "toolbar__sticky" : "")}>
            <div className='mobile-logo-row'>
                <Link to='/' className='nav-logo'>
                    <div className='logo-container'>
                        <div className="logo"></div>
                    </div>
                    <h1>ASL</h1>
                </Link>
            </div>
            <div className='close' onClick={props.drawerClickHandler}><AiOutlineMenu/></div>
        </div>
    )
}

export default Toolbar
