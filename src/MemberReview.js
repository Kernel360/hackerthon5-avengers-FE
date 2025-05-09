import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";

const MemberReview = () => {
    const { memberId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://kernel360-avengers-team.duckdns.org/review/getMemberReview?memberId=${memberId}`)
            .then((res) => res.json())
            .then((data) => {
                // data가 객체 형태일 경우를 대비
                const reviewArray = Array.isArray(data) ? data : data.reviews || [];
                setReviews(reviewArray);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch member reviews:", err);
                setLoading(false);
            });
    }, [memberId]);


    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Container className="mt-4">
            <h2>{memberId}님의 리뷰 목록</h2>
            {reviews.length === 0 ? (
                <p>작성한 리뷰가 없습니다.</p>
            ) : (
                reviews.map((review) => (
                    <Card key={review.reviewId} className="mb-3">
                        <Card.Body>
                            <Card.Title>{review.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                평점: {review.memberRate * 2} | 영화 ID: {review.movieId}
                            </Card.Subtitle>
                            <Card.Text>{review.content}</Card.Text>
                            <Card.Footer className="text-muted">
                                작성일: {new Date(review.postDate).toLocaleString()}
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default MemberReview;
