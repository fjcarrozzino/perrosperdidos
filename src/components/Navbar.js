import React from 'react'
import { Link } from 'react-router-dom'
import "../components/Navbar.css"


const Navbar = () => {
  return (
    <div className='container-header'>
        <div className='logo-container'>
            <Link to={"/"}>
            <img alt='logo' height="100" width="100" src='https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg'></img>
            </Link>
        </div>
        <div className='navbar-container'>
            <ul className='navbar-list'>
                <li><Link to={"/"}>Home</Link></li>
                <li><Link to={"/perros"}>Perros</Link></li>
                <li><Link to={"/formulario"}>Form</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar