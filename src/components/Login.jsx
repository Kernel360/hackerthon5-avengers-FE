import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const payload = {
        email: email,
        password: password
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`https://kernel360-avengers-team.duckdns.org/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            localStorage.setItem('jwt', data.jwt);
            navigate(`/review/getMyReview`);
        } catch (err) {
            alert('로그인 실패');
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">로그인</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}