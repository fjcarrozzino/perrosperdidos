import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Navbar/Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';


const Navbar = () => {
  const userSelector = useSelector(selectUser);
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const [reload, setReload] = useState(false)
  const [user, setUser] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    dispatch(logout())
  }
  console.log(userSelector)


  return (
    <div className='container-header'>
        <div className='logo-container'>
            <Link to={"/"}>
            <img alt='logo' height="100" width="100" src='https://buscandoatobi.com/static/assets/buscandoatobi_isotipo.jpg'></img>
            </Link>
        </div>
        <div className='navbar-container'>
            <ul className='navbar-list'>
                <li><Link to={"/"}>Home</Link></li>
                <li><Link to={"/perros"}>Perros</Link></li>
                <li><Link to={"/formulario"}>Form</Link></li>
                  {
                    userSelector ? <li><Link onClick={logout} to={"/"}>Logout </Link></li> : <li><Link to={"/login"}>Login </Link></li>
                  }
                  {
                    userSelector ? <img className='profile-pic-nav' src={userSelector.picture} alt="profilePic"></img> : ""
                  }
            </ul>
        </div>
    </div>
  )
}

export default Navbar