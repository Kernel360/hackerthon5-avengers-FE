import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import MovieList from "./components/MovieList"; // 영화 목록 컴포넌트
import { useParams } from "react-router-dom";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/movies/:movieId" element={<MovieDetailWrapper />} />
            </Routes>
        </Router>
    );
}

const MovieDetailWrapper = () => {
    const { movieId } = useParams();
    return <MovieDetail movieId={parseInt(movieId)} />;
};

export default App;
