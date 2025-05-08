import React, { useEffect, useState } from 'react';

const MovieCard = ({ movie }) => {
    const renderStars = (voteAverage) => {
        const totalStars = 5;
        const filledStars = Math.round(voteAverage / 2); // 평점은 10점 만점이므로 2로 나누어 5점 만점으로 변환
        const emptyStars = totalStars - filledStars;

        return (
            <>
                {'★'.repeat(filledStars)}{/* 채워진 별 */}
                {'☆'.repeat(emptyStars)}{/* 비어있는 별 */}
            </>
        );
    };

    return (
        <div style={styles.card}>
            <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                style={styles.image}
            />
            <div style={styles.info}>
                <h2>{movie.title}</h2>
                <p><strong>장르:</strong> {movie.genre}</p>
                <p><strong>평점:</strong> {renderStars(movie.vote_average)}</p>
                <p><strong>개봉일:</strong> {movie.release_date}</p>
            </div>
        </div>
    );
};

const MovieList = () => {
    const [movies, setMovies] = useState([]); // 초기값을 빈 배열로 설정

    useEffect(() => {
        fetch('/api/movies')
            .then((res) => res.json())
            .then((data) => {
                if (data.results) {
                    setMovies(data.results); // data.result로 배열을 받아옵니다.
                } else {
                    console.error('Movies data not found:', data);
                }
            })
            .catch((err) => console.error('Error fetching movies:', err));
    }, []);

    return (
        <div style={styles.container}>
            {movies.length > 0 ? (
                movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            ) : (
                <p>영화를 불러오는 중입니다...</p> // 데이터가 없을 때 보여줄 메시지
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
    },
    card: {
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
    info: {
        padding: '16px',
    },
};

export default MovieList;
