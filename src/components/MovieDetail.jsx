import React, { useEffect, useState } from "react";

const MovieDetail = ({ movieId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/movies/${movieId}`)
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

            <h2>리뷰</h2>
            {reviews.length === 0 ? (
                <p>아직 리뷰가 없습니다.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.reviewId}
                         style={{border: "1px solid #ccc", padding: "10px", marginBottom: "10px"}}>
                        <h4>
                            {review.title}
                            {review.memberRate ? ` (평점: ${review.memberRate})` : ' (아직 평점이 없습니다)'}
                        </h4>                        <p>{review.content}</p>
                        <small>작성일: {new Date(review.postDate).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
};

export default MovieDetail;
