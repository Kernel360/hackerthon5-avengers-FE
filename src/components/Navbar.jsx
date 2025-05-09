// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.navLeft}>
                <Link to="/" style={styles.logo}>🎬 Movies</Link>
            </div>
            <div style={styles.navRight}>
                <Link to="/api/login" style={styles.navButton}>로그인</Link>
                <Link to="/api/signup" style={styles.navButton}>회원가입</Link>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    navLeft: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    navRight: {
        display: 'flex',
        gap: '10px',
    },
    navButton: {
        color: 'white',
        textDecoration: 'none',
        padding: '8px 12px',
        border: '1px solid white',
        borderRadius: '4px',
    },
    logo: {
        color: 'white',
        textDecoration: 'none',
    },
};

export default NavBar;
