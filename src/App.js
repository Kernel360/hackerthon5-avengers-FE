import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetail from "./components/MovieDetail";
import MovieList from "./components/MovieList"; // 영화 목록 컴포넌트
import { useParams } from "react-router-dom";
import WriteReview from "./WriteReview";
import MemberReview from "./MemberReview";
import DeleteReview from "./DeleteReview";
import Login from "./components/Login"; //로그인
import Register from "./components/Register"; // 회원가입
import NavBar from './components/Navbar'    //navbar
import MyPage from "./components/MyPage";
import EditReview from "./EditReview"; // 마이페이지 컴포넌트



function App() {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/movies/:movieId" element={<MovieDetailWrapper />} />
                <Route path="/review/write/:movieId" element={<WriteReview />} />
                <Route path="/review/edit/:review" element={<EditReview />} />
                <Route path="/review/delete/:review" element={<DeleteReview />} />
                <Route path="/reviewPage/:memberId" element={<MemberReview />} />
                {/* 회원가입 페이지 라우트 추가 */}
                <Route path="/api/signup" element={<Register />}/>

                {/* 로그인 페이지 라우트 추가 */}
                <Route path="/api/login" element={<Login />}/>
                {/* 마이페이지 라우트 추가 */}
                <Route path="/review/getMyReview" element={<MyPage />} />
            </Routes>
        </Router>
    );
}

const MovieDetailWrapper = () => {
    const { movieId } = useParams();
    return <MovieDetail movieId={parseInt(movieId)} />;
};


export default App;
