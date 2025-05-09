import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; // useParams로 movieId 받아오기, useNavigate로 페이지 이동


const WriteReview = () => {
    const { movieId } = useParams(); // URL에서 movieId 받아오기
    const navigate = useNavigate(); // 페이지 이동 함수
    const [movie, setMovie] = useState(null);
    const [review, setReview] = useState({
        title: "",
        content: "",
        memberRate: 5,
    });

    const [memberId, setMemberId] = useState(0);
    const [nickname, setNickname] = useState("DUMMY DATA");


    useEffect(() => {
        fetch(`/api/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data.movieDto); // 영화 정보 저장
            })
            .catch((error) => {
                console.error("Failed to fetch movie details:", error);
            });
    }, [movieId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prevReview) => ({
            ...prevReview,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 리뷰 데이터 전송
        fetch("/review/createReview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                movieId,
                memberId,
                nickname,
                title: review.title,
                content: review.content,
                memberRate: review.memberRate,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("리뷰가 작성되었습니다!");
                navigate(`/movies/${movieId}`); // 영화 상세 페이지로 이동
            })
            .catch((error) => {
                console.error("Failed to submit review:", error);
                alert("리뷰 작성에 실패했습니다.");
            });
    };

    if (!movie) return <div>영화 정보를 불러오는 중...</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>영화 리뷰 작성</h1>
            <h2>{movie.title}</h2> {/* 영화 제목 */}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formReviewTitle">
                    <Form.Label>리뷰 제목</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={review.title}
                        onChange={handleChange}
                        placeholder="리뷰 제목을 작성해주세요"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formReviewContent">
                    <Form.Label>리뷰 내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="content"
                        value={review.content}
                        onChange={handleChange}
                        placeholder="리뷰 내용을 작성해주세요"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formReviewRating">
                    <Form.Label>평점</Form.Label>
                    <Form.Control
                        as="select"
                        name="memberRate"
                        value={review.memberRate}
                        onChange={handleChange}
                        required
                    >
                        {[1, 2, 3, 4, 5].map((memberRate) => (
                            <option key={memberRate} value={memberRate}>
                                {memberRate}점
                            </option>
                        ))}
                    </Form.Control>

                </Form.Group>
                <Form.Group controlId="formHiddenData">
                    <input type="hidden" name="memberId" value={memberId}/>
                    <input type="hidden" name="nickname" value={nickname}/>
                </Form.Group>

                <Row className="mt-3">
                    <Col>
                        <Button variant="primary" type="submit">
                            리뷰 작성
                        </Button>
                    </Col>
                    <Col className="text-end">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/movies/${movieId}`)}
                        >
                            취소
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default WriteReview;
