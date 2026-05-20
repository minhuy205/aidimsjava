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
    const dicomInputRef = useRef(null);
    const [selectedDicom, setSelectedDicom] = useState(null);

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

    // ── DICOM ──────────────────────────────────────────────────────────
    // Xử lý khi user chọn file .dcm
    const handleDicomUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.dcm')) {
            alert('Chỉ chấp nhận file DICOM (.dcm)');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            alert('File DICOM không được vượt quá 50MB');
            return;
        }

        setSelectedDicom(file);

        // Thông báo cho user biết file đã được chọn
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `🏥 **Đã chọn file DICOM:** ${file.name}\n(${(file.size/1024/1024).toFixed(2)} MB)\n\nNhấn **"🔬 Phân tích DICOM"** để gửi lên server phân tích.`,
            sender: "bot",
            timestamp: new Date()
        }]);

        // Reset input để có thể chọn lại cùng file
        event.target.value = '';
    };

    // Gửi file .dcm lên /api/dicom/analyze
    const sendDicomForAnalysis = async () => {
        if (!selectedDicom) return;

        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `🔬 Đang phân tích DICOM: ${selectedDicom.name}`,
            sender: "user",
            timestamp: new Date()
        }]);

        const fileToSend = selectedDicom;
        setSelectedDicom(null);
        setIsTyping(true);

        try {
            const formData = new FormData();
            formData.append('file', fileToSend);
            formData.append('message', inputMessage.trim() || 'Phân tích hình ảnh DICOM này');

            const response = await fetch('http://localhost:8080/api/dicom/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            const data = await response.json();

            // Response mới có: analysisText, dicomImageBase64, metadata
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.analysisText || data.message || 'Phân tích DICOM hoàn tất!',
                sender: "bot",
                timestamp: new Date(),
                dicomImage: data.dicomImageBase64 || null,   // data URL
                dicomMeta:  data.metadata         || null    // object metadata
            }]);
            setConnectionStatus('connected');
            setInputMessage('');

        } catch (error) {
            console.error('❌ DICOM analysis error:', error);
            setConnectionStatus('disconnected');
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: `❌ **Lỗi phân tích DICOM**\n\n${error.message}\n\n📞 Hỗ trợ: 0777815075`,
                sender: "bot",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };
    // ── end DICOM ──────────────────────────────────────────────────────

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
                                    {/* Ảnh thường (JPG/PNG upload) */}
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

                                    {/* ── DICOM: ảnh convert + metadata ── */}
                                    {message.dicomImage && (
                                        <div style={{
                                            marginBottom: '12px',
                                            border: '1px solid #2a5298',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            background: '#0a0a1a'
                                        }}>
                                            {/* Header ảnh */}
                                            <div style={{
                                                background: '#1a3a6b',
                                                color: '#7eb8f7',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                padding: '6px 10px',
                                                letterSpacing: '0.5px'
                                            }}>
                                                🏥 DICOM IMAGE — {message.dicomMeta?.modality || 'N/A'} | {message.dicomMeta?.imageSize || ''}
                                            </div>

                                            {/* Ảnh DICOM */}
                                            <img
                                                src={message.dicomImage}
                                                alt="DICOM"
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '280px',
                                                    objectFit: 'contain',
                                                    background: '#000',
                                                    display: 'block'
                                                }}
                                            />

                                            {/* Metadata table */}
                                            {message.dicomMeta && (
                                                <div style={{
                                                    padding: '10px',
                                                    fontSize: '11px',
                                                    color: '#cce0ff',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    <div style={{
                                                        color: '#7eb8f7',
                                                        fontWeight: 700,
                                                        marginBottom: '6px',
                                                        fontSize: '11px'
                                                    }}>
                                                        📋 DICOM METADATA
                                                    </div>
                                                    {[
                                                        ['Patient ID',    message.dicomMeta.patientId],
                                                        ['Patient Name',  message.dicomMeta.patientName],
                                                        ['Birth Date',    message.dicomMeta.patientBirthDate],
                                                        ['Sex',           message.dicomMeta.patientSex],
                                                        ['Modality',      message.dicomMeta.modality],
                                                        ['Body Part',     message.dicomMeta.bodyPart],
                                                        ['Study',         message.dicomMeta.studyDescription],
                                                        ['Series',        message.dicomMeta.seriesDescription],
                                                        ['Study Date',    message.dicomMeta.studyDate],
                                                        ['Institution',   message.dicomMeta.institutionName],
                                                        ['Manufacturer',  message.dicomMeta.manufacturer],
                                                        ['Image Size',    message.dicomMeta.imageSize],
                                                        ['Bits',          message.dicomMeta.bitsAllocated],
                                                        ['KVP',           message.dicomMeta.kvp],
                                                        ['Exposure',      message.dicomMeta.exposureTime ? message.dicomMeta.exposureTime + ' ms' : 'N/A'],
                                                    ].filter(([, v]) => v && v !== 'N/A').map(([label, value]) => (
                                                        <div key={label} style={{
                                                            display: 'flex',
                                                            gap: '8px',
                                                            padding: '2px 0',
                                                            borderBottom: '1px solid #1a3a6b'
                                                        }}>
                                                            <span style={{ color: '#7eb8f7', minWidth: '90px' }}>{label}</span>
                                                            <span>{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* ── end DICOM block ── */}

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

                        {/* DICOM Upload Button */}
                        <button
                            onClick={() => dicomInputRef.current?.click()}
                            className="test-btn image-upload"
                            title="Tải lên file DICOM (.dcm)"
                        >
                            🏥 Tải DICOM
                        </button>

                        {/* Nút phân tích DICOM — chỉ hiện khi đã chọn file */}
                        {selectedDicom && (
                            <button
                                onClick={sendDicomForAnalysis}
                                className="test-btn gemini"
                                title={`Phân tích ${selectedDicom.name}`}
                                disabled={isTyping}
                            >
                                🔬 Phân tích DICOM
                            </button>
                        )}
                    </div>

                    {/* Hidden File Input — ảnh thường */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    {/* Hidden File Input — DICOM */}
                    <input
                        ref={dicomInputRef}
                        type="file"
                        accept=".dcm"
                        onChange={handleDicomUpload}
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