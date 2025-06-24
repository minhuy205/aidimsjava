"use client"
import { memo, useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import Layout from "../Layout/Layout"
import Header from "../Layout/Header"
import { symptomService } from "../../services/symptomService"
import { patientService } from "../../services/patientService"
import "../../css/PatientProfile.css"
import "../../css/SymptomDisplay.css"

// Mini Chatbot Component
const MiniChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! Tôi là trợ lý AI của bệnh viện AIDIMS. Tôi có thể giúp bạn tư vấn về triệu chứng bệnh, phân tích hồ sơ bệnh án và hỗ trợ chuyên môn y tế. Bạn cần hỗ trợ gì ạ?",
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

            const fallbackResponse = getFallbackResponse(currentMessage);

            const errorMessage = {
                id: Date.now() + 1,
                text: fallbackResponse,
                sender: "bot",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const getFallbackResponse = (message) => {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("triệu chứng") || lowerMessage.includes("symptom")) {
            return "📋 **Phân tích triệu chứng (Chế độ offline)**\n\n" +
                "Tôi hiểu bạn đang quan tâm về triệu chứng. Dưới đây là hướng dẫn chung:\n\n" +
                "🔍 **Quan sát triệu chứng:**\n" +
                "• Thời gian xuất hiện\n" +
                "• Mức độ nghiêm trọng (1-10)\n" +
                "• Các yếu tố làm tăng/giảm\n" +
                "• Triệu chứng kèm theo\n\n" +
                "📞 **Liên hệ ngay:** (028) 1234-5678\n" +
                "🏥 **Đến khám nếu:** Triệu chứng nặng hoặc kéo dài";
        }

        if (lowerMessage.includes("phân tích") || lowerMessage.includes("chẩn đoán")) {
            return "🩺 **Hỗ trợ phân tích y tế (Offline)**\n\n" +
                "• Ghi nhận triệu chứng chi tiết\n" +
                "• So sánh với tiêu chuẩn y khoa\n" +
                "• Đề xuất hướng điều trị\n" +
                "• Theo dõi tiến triển\n\n" +
                "⚠️ **Lưu ý:** Chỉ bác sĩ mới có thể chẩn đoán chính thức\n" +
                "📞 Tư vấn: (028) 1234-5678";
        }

        return `⚠️ Hệ thống tạm thời offline.\n\n` +
            `Câu hỏi của bạn: "${message}"\n\n` +
            `🏥 **Hỗ trợ tức thì:**\n` +
            `• Tổng đài: (028) 1234-5678\n` +
            `• Cấp cứu: 24/7\n` +
            `• Tư vấn online: aidims.com\n\n` +
            `Tôi sẽ thử kết nối lại...`;
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

    const quickResponses = [
        "Phân tích triệu chứng này",
        "Mức độ nguy hiểm?",
        "Cần khám gấp không?",
        "Cách xử lý ban đầu",
        "Thuốc có thể dùng?"
    ];

    const handleQuickResponse = (text) => {
        setInputMessage(text);
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
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(40,167,69,0.4)',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    border: '3px solid white'
                }}
            >
        <span style={{ fontSize: '24px', color: 'white' }}>
          {isOpen ? '✕' : '🩺'}
        </span>
                <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: getConnectionStatusColor(),
                    borderRadius: '50%',
                    border: '2px solid white',
                    animation: connectionStatus === 'checking' ? 'pulse 1s infinite' : 'none'
                }}></div>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="chat-window"
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '400px',
                        height: '600px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 999,
                        border: '1px solid #e0e0e0',
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            padding: '20px',
                            borderRadius: '16px 16px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 2px 10px rgba(40,167,69,0.2)'
                        }}
                    >
                        <div style={{ fontSize: '28px' }}>🩺</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>AI Y tế AIDIMS</div>
                            <div style={{ fontSize: '12px', opacity: 0.9 }}>
                                {getConnectionStatusText()} • Chuyên khoa
                                {connectionStatus === 'disconnected' && (
                                    <button
                                        onClick={retryConnection}
                                        style={{
                                            marginLeft: '8px',
                                            padding: '2px 6px',
                                            fontSize: '10px',
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            borderRadius: '4px',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Thử lại
                                    </button>
                                )}
                            </div>
                        </div>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: getConnectionStatusColor(),
                            borderRadius: '50%',
                            animation: connectionStatus === 'checking' ? 'pulse 2s infinite' : 'none'
                        }}></div>
                    </div>

                    {/* Connection Warning */}
                    {connectionStatus === 'disconnected' && (
                        <div style={{
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            padding: '12px',
                            fontSize: '12px',
                            borderBottom: '1px solid #ffeaa7',
                            textAlign: 'center'
                        }}>
                            ⚠️ Chế độ offline - Tư vấn cơ bản
                        </div>
                    )}

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            padding: '16px',
                            overflowY: 'auto',
                            backgroundColor: '#f8f9fa'
                        }}
                    >
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    marginBottom: '16px',
                                    display: 'flex',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: '85%',
                                        padding: '12px 16px',
                                        borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        backgroundColor: message.sender === 'user' ? '#28a745' : 'white',
                                        color: message.sender === 'user' ? 'white' : '#333',
                                        fontSize: '14px',
                                        lineHeight: '1.5',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        whiteSpace: 'pre-line'
                                    }}
                                >
                                    {message.text}
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            opacity: 0.7,
                                            marginTop: '6px',
                                            textAlign: message.sender === 'user' ? 'right' : 'left'
                                        }}
                                    >
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                                <div
                                    style={{
                                        padding: '12px 16px',
                                        borderRadius: '20px 20px 20px 4px',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                                        fontSize: '14px'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', color: '#666' }}>Đang phân tích</span>
                                        <div style={{ display: 'flex', gap: '3px' }}>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                backgroundColor: '#28a745',
                                                borderRadius: '50%',
                                                animation: 'bounce 1.4s infinite ease-in-out'
                                            }}></div>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                backgroundColor: '#28a745',
                                                borderRadius: '50%',
                                                animation: 'bounce 1.4s infinite ease-in-out 0.16s'
                                            }}></div>
                                            <div style={{
                                                width: '6px',
                                                height: '6px',
                                                backgroundColor: '#28a745',
                                                borderRadius: '50%',
                                                animation: 'bounce 1.4s infinite ease-in-out 0.32s'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Responses */}
                    <div style={{
                        padding: '8px 16px',
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: 'white'
                    }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Tư vấn nhanh:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {quickResponses.map((response, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickResponse(response)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#e8f5e8',
                                        border: '1px solid #28a745',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        color: '#28a745',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#28a745';
                                        e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#e8f5e8';
                                        e.target.style.color = '#28a745';
                                    }}
                                >
                                    {response}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: '16px',
                            borderTop: '1px solid #e0e0e0',
                            backgroundColor: 'white',
                            borderRadius: '0 0 16px 16px'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi về triệu chứng, chẩn đoán..."
                  disabled={isTyping}
                  style={{
                      flex: 1,
                      border: '2px solid #e0e0e0',
                      borderRadius: '24px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      resize: 'none',
                      minHeight: '20px',
                      maxHeight: '100px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit',
                      backgroundColor: isTyping ? '#f5f5f5' : 'white'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#28a745'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  rows={1}
              />
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isTyping}
                                style={{
                                    backgroundColor: inputMessage.trim() && !isTyping ? '#28a745' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    cursor: inputMessage.trim() && !isTyping ? 'pointer' : 'not-allowed',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: inputMessage.trim() && !isTyping ? '0 2px 8px rgba(40,167,69,0.3)' : 'none'
                                }}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.8);
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </>
    );
};

const SymptomDisplayLayout = () => {
    const location = useLocation()
    const [patientData, setPatientData] = useState(null)
    const [symptomsData, setSymptomsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [debugInfo, setDebugInfo] = useState({})

    // Lấy patientId từ URL params
    const getPatientIdFromUrl = () => {
        const urlParams = new URLSearchParams(location.search)
        return urlParams.get('patientId')
    }

    // Test connection trước khi fetch data
    const testApiConnection = async () => {
        try {
            console.log("Testing API connections...")

            // Test symptom API
            const symptomTest = await symptomService.testConnection()
            console.log("Symptom API test successful:", symptomTest)

            // Test patient endpoints
            await patientService.testPatientEndpoints()

            setDebugInfo(prev => ({ ...prev, apiTest: "success", symptomTest }))
            return true
        } catch (error) {
            console.error("API connection test failed:", error)
            setDebugInfo(prev => ({ ...prev, apiTest: "failed", apiError: error.message }))
            return false
        }
    }

    // Fetch patient data và symptoms data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const patientId = getPatientIdFromUrl()
                // Lấy danh sách bệnh nhân
                const patients = await patientService.getAllPatients()
                const patient = patients.find(p => String(p.patient_id) === String(patientId))
                setPatientData(patient)
                // Lấy triệu chứng
                let symptoms = []
                if (patientId) {
                    symptoms = await symptomService.getSymptomsByPatientId(patientId)
                } else {
                    symptoms = await symptomService.getAllSymptoms()
                }
                setSymptomsData(symptoms)
            } catch (err) {
                setSymptomsData([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [location.search])

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return "N/A"
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    const formatTime = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Test manual symptom creation
    const handleTestCreateSymptom = async () => {
        try {
            const patientId = getPatientIdFromUrl()
            if (!patientId) {
                alert("Không có patient ID")
                return
            }

            console.log("Testing symptom creation...")
            const testSymptom = await symptomService.createQuickSymptom(
                patientId,
                "Test triệu chứng - " + new Date().toLocaleTimeString(),
                "Chi tiết test tạo lúc " + new Date().toLocaleString(),
                "Triệu chứng khác test"
            )

            console.log("Test symptom created:", testSymptom)
            alert("Tạo triệu chứng test thành công!")

            // Refresh symptoms data
            const updatedSymptoms = await symptomService.getSymptomsByPatientId(patientId)
            setSymptomsData(updatedSymptoms)

        } catch (error) {
            console.error("Error creating test symptom:", error)
            alert("Lỗi tạo triệu chứng test: " + error.message)
        }
    }

    // Loading state
    if (loading) {
        return (
            <>
                <Header />
                <Layout>
                    <div className="doctor-page">
                        <div className="patient-list-container">
                            <div className="symptom-display-container">
                                <div style={{ textAlign: "center", padding: "2rem" }}>
                                    <div>🔄 Đang tải thông tin triệu chứng...</div>
                                    <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
                                        <div>Patient ID: {getPatientIdFromUrl()}</div>
                                        <div>API Test: {debugInfo.apiTest || "pending"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Chatbot luôn hiển thị */}
                    <MiniChatbot />
                </Layout>
            </>
        )
    }

    // Error state với debug info
    if (error) {
        return (
            <>
                <Header />
                <Layout>
                    <div className="doctor-page">
                        <div className="patient-list-container">
                            <div className="symptom-display-container">
                                <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
                                    <div>❌ {error}</div>

                                    {/* Debug information */}
                                    <div style={{
                                        marginTop: "20px",
                                        padding: "15px",
                                        background: "#f8f9fa",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        color: "#333",
                                        textAlign: "left"
                                    }}>
                                        <h4>Debug Information:</h4>
                                        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                                    </div>

                                    <div style={{ marginTop: "20px" }}>
                                        <button
                                            onClick={() => window.history.back()}
                                            style={{ marginRight: "10px", padding: "0.5rem 1rem" }}
                                        >
                                            Quay lại
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            style={{ padding: "0.5rem 1rem" }}
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Chatbot luôn hiển thị */}
                    <MiniChatbot />
                </Layout>
            </>
        )
    }

    // No data state
    if (!patientData) {
        return (
            <>
                <Header />
                <Layout>
                    <div className="doctor-page">
                        <div className="patient-list-container">
                            <div className="symptom-display-container">
                                <div style={{ textAlign: "center", padding: "2rem" }}>
                                    <div>📝 Không tìm thấy thông tin bệnh nhân</div>
                                    <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
                                        Debug: {JSON.stringify(debugInfo, null, 2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Chatbot luôn hiển thị */}
                    <MiniChatbot />
                </Layout>
            </>
        )
    }

    return (
        <>
            <Header />
            <Layout>
                <div className="doctor-page">
                    <div className="patient-list-container">
                        <div className="symptom-display-container">
                            {/* Thông tin bệnh nhân */}
                            <div className="symptom-patient-info" style={{marginBottom: '2rem'}}>
                                <h2 style={{marginBottom: '1rem'}}>🩺 Thông tin bệnh nhân</h2>
                                <div style={{color:'#888', marginBottom:'1rem'}}>Ngày khám: {new Date().toLocaleDateString('vi-VN')} - {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</div>
                                <div style={{display:'flex', gap:'2rem', background:'#f8f9fa', borderRadius:'10px', padding:'1.5rem 2rem', marginBottom:'1.5rem'}}>
                                    <div style={{flex:1}}>
                                        <div><b>Mã bệnh nhân:</b> {patientData?.patient_code || 'N/A'}</div>
                                        <div><b>Tuổi/Giới tính:</b> {patientData?.age || 'N/A'} tuổi - {patientData?.gender || 'N/A'}</div>
                                    </div>
                                    <div style={{flex:1}}>
                                        <div><b>Họ và tên:</b> {patientData?.full_name || 'N/A'}</div>
                                        <div><b>Số điện thoại:</b> {patientData?.phone || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hiển thị triệu chứng từ database */}
                            <div className="symptoms-section">
                                <h3>Lịch sử triệu chứng ({symptomsData.length} bản ghi)</h3>
                                <table className="records-table">
                                    <thead>
                                    <tr>
                                        <th>Mã BN</th>
                                        <th>Họ tên</th>
                                        <th>Tuổi</th>
                                        <th>Triệu chứng chính</th>
                                        <th>Chi tiết triệu chứng</th>
                                        <th>Khác</th>
                                        <th>Ngày ghi nhận</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {symptomsData.length > 0 ? (
                                        symptomsData.map((s, idx) => {
                                            // Tách thông tin nhân viên ghi nhận khỏi other_symptoms
                                            let other = s.other_symptoms || '';
                                            let nhanVien = '';
                                            const lines = other.split('\n');
                                            const filtered = lines.filter(line => {
                                                if (line.trim().toLowerCase().startsWith('recorded by')) {
                                                    nhanVien = line.replace('Recorded By:', '').trim();
                                                    return false;
                                                }
                                                return true;
                                            });
                                            return (
                                                <tr key={s.id || idx}>
                                                    <td>{s.patient_code || 'N/A'}</td>
                                                    <td>{s.patient_name || 'Không xác định'}</td>
                                                    <td>{s.patient_age || 'N/A'}</td>
                                                    <td>{s.main_symptom || 'Không có thông tin'}</td>
                                                    <td>{s.detailed_symptoms ? s.detailed_symptoms.split('\n').map((line, i) => <div key={i}>{line.replace('Severity:', 'Mức độ:').replace('Onset:', 'Khởi phát:').replace('Duration:', 'Thời gian:').replace('Pain Scale:', 'Thang điểm đau:')}</div>) : 'Không có chi tiết'}</td>
                                                    <td>{filtered.length > 0 ? filtered.map((line, i) => <div key={i}>{line.replace('Priority:', 'Ưu tiên').replace('Additional Notes:', 'Ghi chú')}</div>) : 'Không có ghi chú'}</td>
                                                    <td>{s.created_at ? new Date(s.created_at).toLocaleString('vi-VN') : 'Chưa xác định'}</td>
                                                    <td>Đã ghi nhận</td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr><td colSpan={8}>Chưa có ghi nhận triệu chứng nào.</td></tr>
                                    )}
                                    </tbody>
                                </table>
                                {/* Hiển thị nhân viên tiếp nhận nếu có */}
                                {symptomsData.length > 0 && (() => {
                                    // Lấy nhân viên ghi nhận mới nhất
                                    let nhanVien = '';
                                    const other = symptomsData[symptomsData.length-1].other_symptoms || '';
                                    other.split('\n').forEach(line => {
                                        if (line.trim().toLowerCase().startsWith('recorded by')) {
                                            nhanVien = line.replace('Recorded By:', '').trim();
                                        }
                                    });
                                    return nhanVien ? (
                                        <div style={{marginTop:'10px', fontStyle:'italic', color:'#444'}}>Nhân viên tiếp nhận: <b>{nhanVien}</b></div>
                                    ) : null;
                                })()}
                            </div>

                            {/* Tóm tắt */}
                            <div className="symptoms-summary">
                                <h3 className="summary-title">
                                    📊 Tóm tắt thông tin
                                </h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Số bản ghi triệu chứng:</span>
                                        <div className="summary-value">{symptomsData.length}</div>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Bản ghi mới nhất:</span>
                                        <div className="summary-value">
                                            {symptomsData.length > 0
                                                ? (symptomsData[symptomsData.length - 1]?.created_at ? formatDate(symptomsData[symptomsData.length - 1]?.created_at) : 'Chưa xác định')
                                                : "Chưa có"
                                            }
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summary-label">Trạng thái:</span>
                                        <div className="summary-value">
                                            {symptomsData.length > 0 ? "Có dữ liệu" : "Chưa có dữ liệu"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="action-buttons">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.history.back()}
                                >
                                    ← Quay lại
                                </button>

                                <button className="btn btn-success">
                                    📊 Tạo báo cáo
                                </button>
                            </div>

                            {/* Debug section */}
                            {debugInfo && (
                                <div style={{
                                    marginTop: "20px",
                                    padding: "15px",
                                    background: "#f8f9fa",
                                    borderRadius: "8px",
                                    fontSize: "12px"
                                }}>
                                    <details>
                                        <summary>Debug Information</summary>
                                        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mini Chatbot - Luôn hiển thị */}
                <MiniChatbot />
            </Layout>
        </>
    )
}

export default memo(SymptomDisplayLayout)