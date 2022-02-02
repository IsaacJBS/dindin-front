import React from 'react';
import logo from '../../assets/logoDindin.svg';
import '../header/header.css';

function Header() {
    return (
        <header className='container-header'>
            <div className="container-header-items">
                <img src={logo} alt="Dindin Logo" />
                <h1>Dindin</h1>
            </div>
        </header>
    )
}

export default Header
