import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ 추가

const MovieCard = ({ movie }) => {
    const renderStars = (voteAverage) => {
        const totalStars = 5;
        const filledStars = Math.round(voteAverage / 2);
        const emptyStars = totalStars - filledStars;

        return (
            <>
                {'★'.repeat(filledStars)}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    return (
        <Link to={`/movies/${movie.movieId}`} style={styles.link}> {/* ✅ 링크로 감쌈 */}
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
                    <p><strong>우리 사이트 평점:</strong> {renderStars(movie.rating)}</p>
                    <p><strong>개봉일:</strong> {movie.release_date}</p>
                </div>
            </div>
        </Link>
    );
};

const MovieList = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch('/api/movies')
            .then((res) => res.json())
            .then((data) => {
                if (data.results) {
                    setMovies(data.results);
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
                <p>영화를 불러오는 중입니다...</p>
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
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    card: {
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        transition: 'transform 0.2s ease',
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
