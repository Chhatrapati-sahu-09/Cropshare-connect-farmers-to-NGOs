import React, { useState, useEffect, useRef } from "react";
import "./CropGuardPage.css";

// --- ICONS (Inline SVGs) ---
const Icons = {
  Sprout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-3.3 3-5.5-1.4-1.3-3.5-1.7-6.2-2.9z" /></svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
  ),
  ShieldCheck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
  ),
  Leaf: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
  ),
};

const DISEASE_DB = [
  {
    id: "late_blight",
    name: "Late Blight",
    scientific: "Phytophthora infestans",
    symptoms: [
      "Dark/black lesions on leaves",
      "White fuzzy mold on leaf undersides",
      "Rotting tubers",
    ],
    prevention: "Use resistant varieties, ensure proper drainage.",
    treatment:
      "Apply fungicides containing mandipropamid or chlorothalonil. Remove and destroy infected plants immediately.",
    crops: ["Potato", "Tomato"],
    keywords: [
      "blight",
      "black spots",
      "dark spots",
      "mold",
      "rotting",
      "potato",
      "tomato",
    ],
  },
  {
    id: "powdery_mildew",
    name: "Powdery Mildew",
    scientific: "Podosphaera xanthii",
    symptoms: [
      "White powdery spots on leaves/stems",
      "Yellowing leaves",
      "Stunted growth",
    ],
    prevention: "Space plants for air circulation, avoid overhead watering.",
    treatment:
      "Spray with neem oil, sulfur, or a mixture of baking soda and water (1 tbsp per gallon).",
    crops: ["Cucumber", "Squash", "Pumpkin", "Grapes"],
    keywords: [
      "powder",
      "white dust",
      "white spots",
      "mildew",
      "fungus",
    ],
  },
  {
    id: "wheat_rust",
    name: "Wheat Rust",
    scientific: "Puccinia triticina",
    symptoms: [
      "Orange/rust-colored pustules on leaves",
      "Yellowing",
      "Weakened stems",
    ],
    prevention: "Plant resistant cultivars, control volunteer wheat.",
    treatment: "Foliar fungicides (Triazoles). Early detection is critical.",
    crops: ["Wheat", "Barley", "Oats"],
    keywords: ["rust", "orange spots", "red dust", "wheat", "grain"],
  },
  {
    id: "healthy",
    name: "Healthy Plant",
    scientific: "N/A",
    symptoms: [
      "Vibrant green color",
      "No visible spots or holes",
      "Strong stems",
    ],
    prevention: "Continue regular care.",
    treatment:
      "Keep up the good work! Maintain regular watering and fertilization schedules.",
    crops: ["All"],
    keywords: ["healthy", "good", "fine", "clean"],
  },
];

function processChatRequest(input) {
  const lowerInput = input.toLowerCase();
  if (lowerInput.match(/^(hi|hello|hey|help)/)) {
    return "Hello! I'm your CropGuard Assistant. Tell me about your crop's symptoms (e.g., 'white powder on leaves') or name a disease.";
  }
  const foundDisease = DISEASE_DB.find(
    (d) =>
      d.keywords.some((k) => lowerInput.includes(k)) ||
      d.name.toLowerCase().includes(lowerInput)
  );
  if (foundDisease) {
    if (foundDisease.id === "healthy")
      return "It sounds like your plant might be healthy! Look for vibrant green leaves.";
    return `That sounds like **${foundDisease.name}**.\n\n**Symptoms:** ${foundDisease.symptoms.join(", ")}.\n**Recommended Treatment:** ${foundDisease.treatment}`;
  }
  return "I'm not sure about that one yet. Try describing the visual symptoms like 'spots', 'yellowing', 'rust', or 'mold'.";
}

export default function CropGuardPage() {
  const [activeTab, setActiveTab] = useState("detect");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    { role: "bot", text: "Welcome to CropGuard! Upload a photo or ask me a question." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, activeTab]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const randomDisease = DISEASE_DB[Math.floor(Math.random() * (DISEASE_DB.length - 1))];
      setAnalysisResult({
        disease: randomDisease,
        confidence: (85 + Math.random() * 14).toFixed(1),
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newHistory = [...chatHistory, { role: "user", text: chatInput }];
    setChatHistory(newHistory);
    const response = processChatRequest(chatInput);
    setTimeout(() => {
      setChatHistory((prev) => [...prev, { role: "bot", text: response }]);
    }, 500);
    setChatInput("");
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: 0 }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <nav style={{ display: 'flex', gap: '2.5rem', borderBottom: '1px solid #e5e7eb', width: '100%', padding: 0 }}>
            <button
              onClick={() => setActiveTab("detect")}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
                fontSize: '1.05rem',
                color: activeTab === 'detect' ? '#15803d' : '#64748b',
                borderBottom: activeTab === 'detect' ? '2px solid #15803d' : '2px solid transparent',
                padding: '1rem 0',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Detect Disease
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
                fontSize: '1.05rem',
                color: activeTab === 'chat' ? '#15803d' : '#64748b',
                borderBottom: activeTab === 'chat' ? '2px solid #15803d' : '2px solid transparent',
                padding: '1rem 0',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Ask Expert
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto p-4 pb-20">
        {/* DETECTION TAB */}
        {activeTab === "detect" && (
          <div className="animate-fadeIn">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem auto 2rem auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a2e35', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Identify Crop Health</h2>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Upload a photo of the affected leaf for instant analysis.</p>
            </div>
            {/* Upload Area */}
            <div className="cropguard-upload-area">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {!selectedImage ? (
                <div
                  className="cropguard-upload-btn"
                  onClick={triggerFileInput}
                >
                  <div className="icon"><Icons.Camera /></div>
                  <div className="label">Upload Photo</div>
                  <div className="desc">JPG, PNG supported</div>
                </div>
              ) : (
                <div className="cropguard-image-preview">
                  <img src={selectedImage} alt="Preview" />
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setAnalysisResult(null); }} className="remove-btn"><Icons.X /></button>
                </div>
              )}
            </div>
            
            {/* Analyze Button */}
            {selectedImage && !analysisResult && (
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="cropguard-analyze-btn"
              >
                {isAnalyzing ? <><span className="spinner"></span>Analyzing...</> : <><Icons.ShieldCheck />Analyze Disease</>}
              </button>
            )}
            
            {/* Results */}
            {analysisResult && (
              <div className="cropguard-result-card animate-slideUp">
                <div className="result-header">
                  <span className="label">Diagnosis</span>
                  <div className="disease-title">
                    {analysisResult.disease.name}
                    {analysisResult.disease.id === "healthy" ? <span className="status-icon healthy"><Icons.CheckCircle /></span> : <span className="status-icon danger"><Icons.AlertTriangle /></span>}
                  </div>
                  <div className="confidence">{analysisResult.confidence}% match confidence</div>
                </div>
                
                <div className="result-body">
                    <div className="section-title"><Icons.Info /> Symptoms</div>
                    <ul className="symptoms-list">
                        {analysisResult.disease.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                <div className="result-footer">
                    <div className="section-title"><Icons.Leaf /> Treatment</div>
                    <p className="treatment-text">{analysisResult.disease.treatment}</p>
                    <div className="prevention-box">
                        <strong>Prevention:</strong> {analysisResult.disease.prevention}
                    </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="cropguard-chatbox animate-fadeIn">
            {/* Chat Header */}
            <div className="cropguard-chat-header">
              <div className="avatar">
                <Icons.Sprout />
              </div>
              <div className="info">
                <h3>Agri-Expert Bot</h3>
                <span className="status"><span className="dot"></span> Online</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="cropguard-chat-messages">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`cropguard-message ${msg.role}`}>
                    {msg.role === 'bot' && <div className="bot-avatar"><Icons.Sprout /></div>}
                    <div className="message-bubble">
                        {msg.text.split("\n").map((line, i) => (
                            <p key={i} className={i > 0 ? "mt-2" : ""}>
                                {line.startsWith("**") ? <strong>{line.replace(/\*\*/g, "")}</strong> : line}
                            </p>
                        ))}
                    </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="cropguard-chat-controls">
                <div className="cropguard-tags-wrapper">
                    {["Potato Blight", "Yellow leaves", "Tomato Rust", "Mildew treatment"].map((tag, i) => (
                    <button
                        key={i}
                        className="chat-tag"
                        onClick={() => setChatInput(tag)}
                    >
                        {tag}
                    </button>
                    ))}
                </div>
                <form className="cropguard-input-wrapper" onSubmit={e => { e.preventDefault(); handleSendMessage(); }}>
                    <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask about symptoms or treatments..."
                    autoFocus
                    />
                    <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="send-btn"
                    >
                    <Icons.Send />
                    </button>
                </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}