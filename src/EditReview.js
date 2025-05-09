import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const EditReview = () => {
    const { reviewId } = useParams(); // ✅ URL에서 reviewId 추출
    const [review, setReview] = useState(null); // review 상태와 그 값을 설정하는 함수
    const navigate = useNavigate();
    console.log("reviewId:", reviewId);  // 값이 잘 출력되는지 확인

    useEffect(() => {
        fetch(`https://kernel360-avengers-team.duckdns.org/review/getOneReview/${reviewId}`)
            .then((res) => res.json())
            .then((data) => setReview(data))
            .catch((err) => {
                alert("리뷰를 불러오지 못했습니다.");
                console.error(err);
            });
    }, [reviewId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("호출됨");
        fetch(`https://kernel360-avengers-team.duckdns.org/review/updateReview?reviewId=${reviewId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewId: review.reviewId,
                movieId: review.movieId,
                memberId: review.memberId,
                nickname: review.nickname,
                title: review.title,
                content: review.content,
                memberRate: review.memberRate,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    alert("리뷰가 수정되었습니다.");
                    navigate(`/movies/${review.movieId}`);
                } else {
                    throw new Error("수정 실패");
                }
            })
            .catch((err) => {
                alert("리뷰 수정에 실패했습니다.");
                console.error(err);
            });
    };

    if (!review) return <div>리뷰 정보를 불러오는 중...</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>리뷰 수정</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={review.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="content"
                        value={review.content}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
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

                <Form.Group className="mt-2">
                    <Form.Label>작성자</Form.Label>
                    <Form.Control type="text" value={review.nickname} readOnly />
                </Form.Group>

                <Row className="mt-3">
                    <Col>
                        <Button type="submit" variant="primary">
                            수정 완료
                        </Button>
                    </Col>
                    <Col className="text-end">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            취소
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EditReview;
