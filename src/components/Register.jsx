import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        // Create payload
        const payload = {
            email: email,
            password: password,
            nickname: nickname
        };

        try {
            const response = await fetch(`https://kernel360-avengers-team.duckdns.org/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('회원가입 성공! 로그인 해주세요.');
                navigate(`https://kernel360-avengers-team.duckdns.org/api/login`);  // /api/login은 API 엔드포인트이고, 실제 페이지는 /login일 가능성이 높습니다
            } else {
                const errorData = await response.text();
                alert(`회원가입 실패: ${errorData}`);
            }
        } catch (err) {
            alert('회원가입 실패: ' + err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">회원가입</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
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
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
}