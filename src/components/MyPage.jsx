// src/pages/MyPage.jsx
import React, { useEffect, useState } from 'react';

const MyPage = () => {
    const [member, setMember] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt');

        if (token) {
            fetch('/api/user/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('유저 정보를 불러오지 못했습니다.');
                    }
                    return res.json();
                })
                .then((data) => {
                    setMember(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, []);

    if (!member) return <div>로딩 중...</div>;

    return (
        <div style={styles.container}>
            <h2>마이페이지</h2>
            <div style={styles.infoBox}>
                <p><strong>닉네임:</strong> {member.nickname}</p>
                <p><strong>이메일:</strong> {member.email}</p>
                <p><strong>등록일:</strong> {new Date(member.registeredAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
    },
    infoBox: {
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
};

export default MyPage;
