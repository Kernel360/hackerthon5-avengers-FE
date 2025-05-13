import React, { useEffect, useState } from 'react';

const MyPage = () => {
    const [member, setMember] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) return;
        
        // 유저 정보
        fetch('${process.env.REACT_APP_API_BASE_URL}/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => setMember(data))
            .catch(console.error);

        // 유저 리뷰
        fetch('${process.env.REACT_APP_API_BASE_URL}/review/getMyReview', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(console.error);
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

            <h3 style={{ marginTop: '30px' }}>내가 작성한 리뷰</h3>
            {reviews.length === 0 ? (
                <p>작성한 리뷰가 없습니다.</p>
            ) : (
                <ul style={styles.reviewList}>
                    {reviews.map((review) => (
                        <li key={review.id} style={styles.reviewItem}>
                            <h4>{review.title}</h4>
                            <p><strong>영화:</strong> {review.movieTitle}</p>
                            <p><strong>내용:</strong> {review.content}</p>
                            <p><strong>평점:</strong> {review.memberRate} / 5</p>
                            <p><small>작성일: {new Date(review.postDate).toLocaleDateString()}</small></p>
                            {review.updateDate && (
                                <p><small>수정일: {new Date(review.updateDate).toLocaleDateString()}</small></p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '700px',
        margin: '0 auto'
    },
    infoBox: {
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    reviewList: {
        listStyle: 'none',
        padding: 0
    },
    reviewItem: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '15px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
    }
};

export default MyPage;
