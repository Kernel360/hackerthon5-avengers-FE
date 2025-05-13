import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ✅ AuthContext에서 jwt 가져오기

const WriteReview = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const { jwt } = useAuth(); // ✅ 로그인 토큰 가져오기
    const [review, setReview] = useState({
        title: "",
        content: "",
        memberRate: 5,
    });

    const [memberId, setMemberId] = useState(null);
    const [nickname, setNickname] = useState("");

    // 영화 정보 불러오기
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data.movieDto);
            })
            .catch((error) => {
                console.error("Failed to fetch movie details:", error);
            });
    }, [movieId]);

    // ✅ 로그인된 유저 정보 불러오기
    useEffect(() => {
        if (!jwt) return;

        fetch("${process.env.REACT_APP_API_BASE_URL}/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("인증 실패");
                return res.json();
            })
            .then((data) => {
                setMemberId(data.memberId);
                setNickname(data.nickname);
            })
            .catch((err) => {
                console.error("사용자 정보 로딩 실패:", err);
                alert("로그인이 필요합니다.");
                navigate("/api/login");
            });
    }, [jwt]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("${process.env.REACT_APP_API_BASE_URL}/review/createReview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`, // ✅ JWT 함께 전송
            },
            body: JSON.stringify({
                movieId,
                memberId,
                nickname,
                ...review,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("리뷰가 작성되었습니다!");
                navigate(`/movies/${movieId}`);
            })
            .catch((error) => {
                console.error("리뷰 등록 실패:", error);
                alert("리뷰 작성에 실패했습니다.");
            });
    };

    if (!movie) return <div>영화 정보를 불러오는 중...</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>영화 리뷰 작성</h1>
            <h2>{movie.title}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formReviewTitle">
                    <Form.Label>리뷰 제목</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={review.title}
                        onChange={handleChange}
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
                        {[1, 2, 3, 4, 5].map((rate) => (
                            <option key={rate} value={rate}>
                                {rate}점
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Row className="mt-3">
                    <Col>
                        <Button variant="primary" type="submit">
                            리뷰 작성
                        </Button>
                    </Col>
                    <Col className="text-end">
                        <Button variant="secondary" onClick={() => navigate(`/movies/${movieId}`)}>
                            취소
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default WriteReview;
