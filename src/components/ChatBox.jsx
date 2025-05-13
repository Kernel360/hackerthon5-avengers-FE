import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const ChatBox = ({ movieId }) => {
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('${process.env.REACT_APP_API_BASE_URL}/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/sub/chat/room/${movieId}`, (msg) => {
                    const chat = JSON.parse(msg.body);
                    setChatMessages((prev) => [...prev, chat]);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, [movieId]);

    const sendMessage = () => {
        if (!nickname.trim()) {
            alert('닉네임을 입력해주세요.');
            return;
        }
        if (!message.trim()) return;

        const payload = {
            movieId: movieId.toString(),
            sender: nickname,
            message: message,
        };

        stompClient.publish({
            destination: '/pub/chat/message',
            body: JSON.stringify(payload),
        });

        setMessage('');
    };

    return (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>실시간 채팅</h3>

            <input
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ width: '30%', marginBottom: '10px', padding: '5px' }}
            />

            <div style={{
                border: '1px solid #ddd',
                height: '200px',
                overflowY: 'scroll',
                padding: '5px',
                marginBottom: '10px'
            }}>
                {chatMessages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>

            <input
                type="text"
                placeholder="메시지를 입력하세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '75%', padding: '5px' }}
            />
            <button
                onClick={sendMessage}
                style={{ marginLeft: '10px', padding: '5px 10px' }}
                disabled={!stompClient || !stompClient.connected}
            >
                전송
            </button>
        </div>
    );
};

export default ChatBox;
