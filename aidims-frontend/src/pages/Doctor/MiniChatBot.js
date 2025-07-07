// MiniChatbot.js
import { useState, useEffect, useRef } from "react";
import "../../css/MiniChatBot.css";

const MiniChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! Tôi là trợ lý AI của bệnh viện AIDIMS.\n\n🩺 **Tôi có thể hỗ trợ:**\n• Phân tích triệu chứng\n• Phân tích hình ảnh y tế (X-quang, CT, MRI)\n• Tư vấn chẩn đoán ban đầu\n• Đề xuất xét nghiệm\n\n📷 **Gửi hình ảnh:** Nhấn nút 📷 để tải lên hình ảnh y tế",
            sender: "bot",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageAnalysisMode, setImageAnalysisMode] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

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

    // Xử lý chọn file hình ảnh
    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

            if (!isValidType) {
                alert('Chỉ chấp nhận file hình ảnh (JPG, PNG, WEBP, etc.)');
                return false;
            }
            if (!isValidSize) {
                alert('File hình ảnh không được vượt quá 10MB');
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setSelectedImages(prev => [...prev, ...validFiles]);
            setImageAnalysisMode(true);

            // Hiển thị preview
            const imageMessage = {
                id: Date.now(),
                text: `📷 **Đã tải lên ${validFiles.length} hình ảnh**\n\nVui lòng mô tả câu hỏi về hình ảnh này (ví dụ: "Phân tích X-quang ngực này", "Đánh giá CT scan", "Tìm bất thường trong ảnh")`,
                sender: "bot",
                timestamp: new Date(),
                images: validFiles
            };

            setMessages(prev => [...prev, imageMessage]);
        }
    };

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    // Gửi tin nhắn với hình ảnh
    const sendMessageWithImages = async () => {
        if (!inputMessage.trim() && selectedImages.length === 0) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage || "Phân tích hình ảnh này",
            sender: "user",
            timestamp: new Date(),
            images: selectedImages
        };

        setMessages(prev => [...prev, userMessage]);
        const currentMessage = inputMessage;
        const currentImages = [...selectedImages];

        setInputMessage('');
        setSelectedImages([]);
        setImageAnalysisMode(false);
        setIsTyping(true);

        try {
            console.log('🚀 Sending message with images to server');

            // Convert images to base64
            const imageData = await Promise.all(
                currentImages.map(async (file) => ({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: await fileToBase64(file)
                }))
            );

            const requestBody = {
                message: currentMessage || "Phân tích hình ảnh y tế này",
                images: imageData,
                analysisType: "medical_image"
            };

            const response = await fetch('http://localhost:8080/api/chat/analyze-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 Server response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📨 Server response data:', data);

            const botMessage = {
                id: Date.now() + 1,
                text: data.message || "Đã phân tích hình ảnh thành công!",
                sender: "bot",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setConnectionStatus('connected');

        } catch (error) {
            console.error('❌ Error analyzing image:', error);
            setConnectionStatus('disconnected');

            const errorMessage = {
                id: Date.now() + 1,
                text: "❌ **Lỗi phân tích hình ảnh**\n\nKhông thể phân tích hình ảnh lúc này. Vui lòng:\n• Kiểm tra kết nối mạng\n• Thử lại với hình ảnh khác\n• Liên hệ IT nếu lỗi tiếp diễn\n\n📞 **Hỗ trợ:** 0777815075",
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const testGeminiOnly = async () => {
        try {
            console.log('🤖 Testing Gemini API...');

            const response = await fetch('http://localhost:8080/api/chat/test-gemini?', {
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
        if (selectedImages.length > 0) {
            return sendMessageWithImages();
        }

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

    // Xóa hình ảnh đã chọn
    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        if (selectedImages.length === 1) {
            setImageAnalysisMode(false);
        }
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
                                {getConnectionStatusText()} • Chuyên khoa {imageAnalysisMode && '• 📷 Phân tích ảnh'}
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
                                    {/* Hiển thị hình ảnh nếu có */}
                                    {message.images && message.images.length > 0 && (
                                        <div className="message-images">
                                            {message.images.map((image, index) => (
                                                <div key={index} className="message-image">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Upload ${index + 1}`}
                                                        style={{
                                                            maxWidth: '200px',
                                                            maxHeight: '200px',
                                                            borderRadius: '8px',
                                                            marginBottom: '8px'
                                                        }}
                                                    />
                                                    <div className="image-info">
                                                        📄 {image.name} ({(image.size/1024/1024).toFixed(1)}MB)
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

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
                                        <span className="typing-text">
                                            {imageAnalysisMode || selectedImages.length > 0 ? 'Đang phân tích hình ảnh' : 'Đang phân tích'}
                                        </span>
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

                    {/* Selected Images Preview */}
                    {selectedImages.length > 0 && (
                        <div className="selected-images-preview">
                            <div className="preview-header">
                                📷 **Hình ảnh đã chọn ({selectedImages.length}):**
                            </div>
                            <div className="preview-images">
                                {selectedImages.map((image, index) => (
                                    <div key={index} className="preview-image">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="remove-image-btn"
                                            title="Xóa hình ảnh"
                                        >
                                            ✕
                                        </button>
                                        <div className="image-name">{image.name.substring(0, 10)}...</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Test Buttons */}
                    <div className="chat-test-buttons">
                        <button
                            onClick={testGeminiOnly}
                            className="test-btn gemini"
                        >
                            🤖 Test Gemini
                        </button>



                        {/* Image Upload Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="test-btn image-upload"
                            title="Tải lên hình ảnh y tế"
                        >
                            📷 Phân tích ảnh
                        </button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    {/* Input */}
                    <div className="chat-input">
                        <div className="input-container">
                            <textarea
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={
                                    selectedImages.length > 0
                                        ? "Mô tả câu hỏi về hình ảnh (ví dụ: 'Phân tích X-quang này')..."
                                        : "Hỏi về triệu chứng, chẩn đoán..."
                                }
                                disabled={isTyping}
                                className="input-textarea"
                                rows={1}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={(!inputMessage.trim() && selectedImages.length === 0) || isTyping}
                                className={`send-button ${(inputMessage.trim() || selectedImages.length > 0) && !isTyping ? 'enabled' : 'disabled'}`}
                            >
                                {selectedImages.length > 0 ? '🔍' : '➤'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MiniChatbot;