import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopMovie from "./TopMovie";

const MovieCard = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false);

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
        <Link
            to={`/movies/${movie.movieId}`}
            style={styles.link}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                style={{
                    ...styles.card,
                    ...(isHovered && styles.cardHover),
                }}
            >
                <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    style={styles.image}
                />
                <div style={styles.info}>
                    <h2>{movie.title}</h2>
                    <p><strong>장르:</strong> {movie.genre}</p>
                    <p><strong>평점:</strong> {renderStars(movie.vote_average)}</p>
                    <p><strong>우리 사이트 평점:</strong> {renderStars(movie.rating*2)}</p>
                    <p><strong>개봉일:</strong> {movie.release_date}</p>
                </div>
            </div>
        </Link>
    );
};

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('');

    const fetchMovies = useCallback(() => {
        const params = new URLSearchParams({
            page: currentPage,
            size: 20,
            keyword,
            searchType,
        });

        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/movies?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.results) {
                    setMovies(data.results);
                    setTotalPages(data.totalPages);
                } else {
                    console.error('Movies data not found:', data);
                }
            })
            .catch((err) => console.error('Error fetching movies:', err));
    }, [currentPage, keyword, searchType]);

    const handleSearch = () => {
        setCurrentPage(0); // 검색 시 첫 번째 페이지로 초기화
        fetchMovies(); // 검색 버튼 클릭 시 데이터 가져오기
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    style={{
                        ...styles.pageButton,
                        backgroundColor: i === currentPage ? '#007BFF' : '#fff',
                        color: i === currentPage ? '#fff' : '#007BFF',
                    }}
                >
                    {i + 1}
                </button>
            );
        }
        return <div style={styles.pagination}>{pages}</div>;
    };

    useEffect(() => {
        fetchMovies();
    }, [currentPage]); // keyword와 searchType 의존성 제거

    return (
        <div style={styles.container}>
            <TopMovie />

            <div style={styles.searchBox}>
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={styles.select}>
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="description">설명</option>
                </select>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    placeholder="검색어 입력"
                    style={styles.searchInput}
                />
                <button onClick={handleSearch} style={styles.searchButton}>검색</button>
            </div>

            <div style={styles.movieCards}>
                {movies.length > 0 ? (
                    movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    <p>영화를 불러오는 중입니다...</p>
                )}
            </div>
            {totalPages > 1 && renderPagination()}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    searchBox: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    select: {
        padding: '8px',
        fontSize: '16px',
    },
    searchInput: {
        padding: '8px',
        flex: 1,
        fontSize: '16px',
    },
    searchButton: {
        padding: '8px 16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    movieCards: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'flex-start', // 영화 카드들이 왼쪽 정렬되도록 변경
    },
    card: {
        width: '250px',
        height: '750px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHover: {
        transform: 'scale(1.05)',
    },
    image: {
        width: '250px',
        height: '430px',
        objectFit: 'cover',
    },
    info: {
        padding: '10px',
        backgroundColor: '#fff',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
    },
    pageButton: {
        padding: '10px 15px',
        margin: '0 5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default MovieList;