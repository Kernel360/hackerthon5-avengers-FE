import React, { useEffect, useState } from "react";
import ChatBox from './ChatBox';
import { Button, Row, Col } from "react-bootstrap"; // 부트스트랩 컴포넌트 임포트
import {Link, useNavigate} from "react-router-dom"; // useNavigate 추가

import { jwtDecode } from 'jwt-decode';


const MovieDetail = ({ movieId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const [currentMemberId, setCurrentMemberId] = useState(0);

    useEffect(() => {
        // 로그인한 사용자 정보 디코딩
        const token = localStorage.getItem("jwt");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Decoded JWT:", decoded); // 확인용
                setCurrentMemberId(decoded.memberId); // claim 이름에 따라 수정 필요
            } catch (err) {
                console.error("JWT decode error:", err);
            }
        }
    }, []);


    useEffect(() => {
        fetch(`https://kernel360-avengers-team.duckdns.org/api/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch movie details:", error);
                setLoading(false);
            });
    }, [movieId]);

    const handleDelete = (reviewId) => {
        if (window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
            fetch(`/review/deleteReview?reviewId=${reviewId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reviewId }), // 또는 API가 요구하는 형식
            })
                .then((res) => {
                    if (!res.ok) throw new Error("삭제 실패");
                    alert("리뷰가 삭제되었습니다.");
                    // 삭제 후 리뷰 목록 새로고침
                    return fetch(`/api/movies/${movieId}`)
                        .then((res) => res.json())
                        .then((data) => setData(data));
                })
                .catch((err) => {
                    console.error("삭제 실패:", err);
                    alert("리뷰 삭제 중 오류가 발생했습니다.");
                });
        }
    };


    if (loading) return <div>Loading...</div>;
    if (!data) return <div>영화 정보를 불러올 수 없습니다.</div>;

    const { movieDto, reviews } = data;

    return (
        <div style={{padding: "20px"}}>
            <h1>{movieDto.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w300${movieDto.poster_path}`} alt={movieDto.title}/>
            <p><strong>장르:</strong> {movieDto.genre}</p>
            <p><strong>개봉일:</strong> {movieDto.release_date}</p>
            <p><strong>평점:</strong> {movieDto.vote_average}</p>
            <p><strong>우리 사이트
                별점:</strong> {isNaN(movieDto.rating) || movieDto.rating == null ? '아직 별점이 없습니다' : movieDto.rating*2}</p>
            <p><strong>줄거리:</strong> {movieDto.overview ? movieDto.overview : '줄거리가 없습니다'}</p>

            <Row className="d-flex justify-content-between align-items-center">
                <Col>
                    <h2>리뷰</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary" // 버튼 색상
                        size="lg" // 버튼 크기
                        onClick={() => navigate(`/review/write/${movieId}`)}
                    >
                        리뷰 작성하기 🥹
                    </Button>
                </Col>
            </Row>

            {Array.isArray(reviews) ? (
                reviews.map((review) => (
                    <div key={review.reviewId} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h4>{review.title} (평점: {review.memberRate * 2})</h4>
                        <p>{review.content}</p>
                        <small>
                            <Link to={`/reviewPage/${review.memberId}`} style={{ textDecoration: 'none' }}>
                                {review.nickname}
                            </Link>, {new Date(review.postDate).toLocaleString()}
                        </small>
                        {/* 로그인한 사용자만 수정/삭제 버튼 보이게 */}
                        {String(currentMemberId) === String(review.memberId) && (
                            <div className="mt-2">
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => navigate(`/review/edit/${review.reviewId}`)}
                                >
                                    수정
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(review.reviewId)}
                                >
                                    삭제
                                </Button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>리뷰 정보가 없습니다.</p>
            )}
            <h2>영화 채팅</h2>
            <ChatBox movieId={movieId} />


        </div>
    );
};

export default MovieDetail;
