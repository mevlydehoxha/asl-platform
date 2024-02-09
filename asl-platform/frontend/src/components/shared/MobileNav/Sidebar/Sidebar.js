import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { CgClose } from 'react-icons/cg'
import { BiNews } from 'react-icons/bi'
import { AiOutlineInfoCircle, AiFillHome } from 'react-icons/ai';
import {LiaMoneyCheckAltSolid} from 'react-icons/lia'
import useAuth from '../../../Auth/useAuth';
import Cookies from 'js-cookie';
import axios from 'axios';

const Sidebar = (props) => {    

    const isAuthenticated = useAuth();
    const navigate = useNavigate(); 
    const [role, setRole] = useState()
  
    const handleLogout = () => {
      Cookies.remove('token');
      navigate('/login')
    }

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) { 
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios
            .get('http://localhost:8000/api/user')
            .then((response) => {
              setRole(response.data.user.role)
            })
            .catch((error) => {
              console.error('Error fetching user:', error);
            });
        }
      }, []);

    return (
        <div className='mobile-sidebar'>
             <div className='sidebar-logo-row'>
                <Link to='/' className='nav-logo'>
                    <div className='logo-container'>
                        <div className="logo"></div>
                    </div>
                    <h1>ASL</h1>
                </Link>
                <div className='close' onClick={props.click}><CgClose/> </div>
            </div>
            <div className='mobile-sidebar-links'>
                <div className='sidebar-dropdown'>
                    <div className='nav-sidebar-link'>
                        <Link to='/home' className='nav-anchor'>
                            <AiFillHome />
                            Home
                        </Link>
                    </div>
                </div>

                <div className='nav-sidebar-link'>
                    <Link to='/donations' className='nav-anchor'>
                        <LiaMoneyCheckAltSolid />
                        Donations
                    </Link>
                </div>
                <div className='nav-sidebar-link'>
                    <Link to='/news' className='nav-anchor'>
                        <BiNews />
                        News&Events
                    </Link>
                </div>

                <div className='sidebar-dropdown'>
                    <div className='nav-sidebar-link'>
                        <Link to='/' className='nav-anchor'>
                            <AiOutlineInfoCircle />
                            About
                        </Link>
                    </div>
                </div>
            </div>
            {isAuthenticated ?
                <div className='sidebar-auth'>
                  {role==='admin' ?  
                        <Link to='/admin' className='link1'>
                            Admin
                        </Link> : ''}
                    <div onClick={handleLogout} className='link2'>
                        <span>
                            Log out
                        </span>
                    </div>
                </div>
            :
            <div className='sidebar-auth'>
                <Link to='/login' className='link1'>
                    Login
                </Link>
                <Link to='/register' className='link2'>
                    <span>
                        Sign up
                    </span>
                </Link>
            </div>
        }
            <div className='space'></div>
        </div>
    )
}

export default Sidebar
