import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TopMovie = () => {
    const [topMovies, setTopMovies] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/movies/getPopular`)
            .then((res) => res.json())
            .then((data) => {
                if (data.results) {
                    setTopMovies(data.results.slice(0, 10)); // 상위 10개만
                } else {
                    console.error('Popular movies data not found:', data);
                }
            })
            .catch((err) => console.error('Error fetching top movies:', err));
    }, []);

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
        <div style={styles.topContainer}>
            <h2 style={styles.heading}>인기 영화 TOP 10</h2>
            <div style={styles.list}>
                {topMovies.map((movie) => (
                    <Link key={movie.movieId} to={`/movies/${movie.movieId}`} style={styles.link}>
                        <div style={styles.card}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                style={styles.image}
                            />
                            <div style={styles.info}>
                                <h3>{movie.title}</h3>
                                <p>{renderStars(movie.vote_average)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const styles = {
    topContainer: {
        width: '100%',
        padding: '20px',
        backgroundColor: '#f8f8f8',
        borderBottom: '1px solid #ddd',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '16px',
    },
    list: {
        display: 'flex',
        overflowX: 'auto',
        gap: '16px',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    card: {
        minWidth: '150px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
    info: {
        padding: '8px',
    },
};

export default TopMovie;
