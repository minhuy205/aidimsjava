// MiniChatbot.js
import { useState, useEffect, useRef } from "react";
import "../../css/MiniChatBot.css";

const MiniChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! Tôi là trợ lý AI của bệnh viện AIDIMS.",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        checkServerConnection();
    }, []);

    const checkServerConnection = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/chat/health', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setConnectionStatus('connected');
                console.log('✅ Server connection successful');
            } else {
                setConnectionStatus('disconnected');
                console.log('❌ Server responded with error:', response.status);
            }
        } catch (error) {
            setConnectionStatus('disconnected');
            console.error('❌ Server connection failed:', error);
        }
    };

    const testGeminiOnly = async () => {
        try {
            console.log('🤖 Testing Gemini API...');

            const response = await fetch('http://localhost:8080/api/chat/test-gemini?message=đau ngực', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.text();
            console.log('Gemini Test Result:', data);

            const testMessage = {
                id: Date.now(),
                text: `🤖 **TEST GEMINI:**\n\n${data}`,
                sender: "bot",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, testMessage]);

        } catch (error) {
            console.error('❌ Gemini test failed:', error);

            const errorMessage = {
                id: Date.now(),
                text: `❌ **GEMINI TEST FAILED:**\n${error.message}`,
                sender: "bot",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentMessage = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        try {
            console.log('🚀 Sending message to server:', currentMessage);

            const response = await fetch('http://localhost:8080/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message: currentMessage })
            });

            console.log('📡 Server response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📨 Server response data:', data);

            const botMessage = {
                id: Date.now() + 1,
                text: data.message || "Đã nhận được tin nhắn của bạn!",
                sender: "bot",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setConnectionStatus('connected');

        } catch (error) {
            console.error('❌ Error sending message:', error);
            setConnectionStatus('disconnected');

            const errorMessage = {
                id: Date.now() + 1,
                text: "Xin lỗi, hiện tại hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getConnectionStatusColor = () => {
        switch(connectionStatus) {
            case 'connected': return '#4CAF50';
            case 'disconnected': return '#f44336';
            default: return '#ff9800';
        }
    };

    const getConnectionStatusText = () => {
        switch(connectionStatus) {
            case 'connected': return 'Trực tuyến';
            case 'disconnected': return 'Offline';
            default: return 'Đang kết nối...';
        }
    };

    const retryConnection = () => {
        setConnectionStatus('checking');
        checkServerConnection();
    };

    return (
        <>
            {/* Chat Icon */}
            <div
                className={`chat-icon ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="chat-icon-emoji">
                    {isOpen ? '✕' : '🩺'}
                </span>
                <div
                    className={`chat-icon-status ${connectionStatus === 'checking' ? 'checking' : ''}`}
                    style={{ backgroundColor: getConnectionStatusColor() }}
                ></div>
            </div>

            {/* Backdrop for expanded mode */}
            {isOpen && isExpanded && (
                <div
                    className="chat-backdrop"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`chat-window ${isExpanded ? 'expanded' : ''}`}>
                    {/* Header */}
                    <div className="chat-header">
                        <div className="chat-header-icon">🩺</div>
                        <div className="chat-header-content">
                            <div className="chat-header-title">AI Y tế AIDIMS</div>
                            <div className="chat-header-subtitle">
                                {getConnectionStatusText()} • Chuyên khoa
                                {connectionStatus === 'disconnected' && (
                                    <button
                                        onClick={retryConnection}
                                        className="chat-retry-btn"
                                    >
                                        Thử lại
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="chat-expand-btn"
                            title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                        >
                            {isExpanded ? '🗗' : '🗖'}
                        </button>

                        <div
                            className={`chat-status-indicator ${connectionStatus === 'checking' ? 'checking' : ''}`}
                            style={{ backgroundColor: getConnectionStatusColor() }}
                        ></div>
                    </div>

                    {/* Connection Warning */}
                    {connectionStatus === 'disconnected' && (
                        <div className="chat-warning">
                            ⚠️ Chế độ offline - Tư vấn cơ bản
                        </div>
                    )}

                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-container ${message.sender}`}
                            >
                                <div className={`message-bubble ${message.sender}`}>
                                    {message.text}
                                    <div className={`message-time ${message.sender}`}>
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="typing-bubble">
                                    <div className="typing-content">
                                        <span className="typing-text">Đang phân tích</span>
                                        <div className="typing-dots">
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                            <div className="typing-dot"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Test Buttons */}
                    <div className="chat-test-buttons">
                        <button
                            onClick={testGeminiOnly}
                            className="test-btn gemini"
                        >
                            🤖 Test Gemini
                        </button>

                        <button
                            onClick={() => {
                                const sampleMessage = "đau ngực + khó thở";
                                setInputMessage(sampleMessage);
                            }}
                            className="test-btn sample"
                        >
                            💡 Mẫu câu hỏi
                        </button>
                    </div>

                    {/* Input */}
                    <div className="chat-input">
                        <div className="input-container">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Hỏi về triệu chứng, chẩn đoán..."
                                disabled={isTyping}
                                className="input-textarea"
                                rows={1}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                className={`send-button ${inputMessage.trim() && !isTyping ? 'enabled' : 'disabled'}`}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MiniChatbot;