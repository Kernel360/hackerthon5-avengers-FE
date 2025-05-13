// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 경로 확인

const NavBar = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navLeft}>
                <Link to="/" style={styles.logo}>🎬 Movies</Link>
            </div>
            <div style={styles.navRight}>
                {isLoggedIn ? (
                    <>
                        <Link to="/review/getMyReview" style={styles.navButton}>마이페이지</Link>
                        <button onClick={handleLogout} style={styles.navButton}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/api/login" style={styles.navButton}>로그인</Link>
                        <Link to="/api/signup" style={styles.navButton}>회원가입</Link>
                    </>
                )}
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
        background: 'transparent',
        cursor: 'pointer'
    },
    logo: {
        color: 'white',
        textDecoration: 'none',
    },
};

export default NavBar;
