import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import api, { markMessagesAsRead } from "../services/api.js"; // Use our axios instance directly
import socket from "../services/socket.js";
import Loader from "../components/Loader.jsx";
import "../styles/ChatPage.css";
import NotificationContext from "../contexts/NotificationContext.jsx";
import { useContext } from "react";

const ChatPage = () => {
  const { receiverId } = useParams();
  const { user } = useAuth();
  const { fetchCounts } = useContext(NotificationContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const chatBoxRef = useRef(null);

  // 1. Fetch History & Setup Socket
  useEffect(() => {
    if (!user) return;
                                                                                                    
    // Join my own room to receive messages
    socket.emit("join_chat", user._id);

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${receiverId}`);
        setMessages(data);
        setLoading(false);

        // Mark messages from this sender as read and update notification count
        try {
          await markMessagesAsRead(receiverId);
          // Refresh the notification count
          if (fetchCounts) {
            fetchCounts();
          }
        } catch (err) {
          console.error("Failed to mark messages as read", err);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
        setLoading(false);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      // Only add if it belongs to this conversation
      if (msg.senderId === receiverId || msg.receiverId === receiverId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [receiverId, user, fetchCounts]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Send via API (Backend will handle DB save + Socket emit)
      const { data } = await api.post("/messages", {
        receiverId,
        message: newMessage,
      });

      // Add to our own UI immediately
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="chat-container">
      <div className="chat-header">Chat with User</div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.senderId === user._id ? "sent" : "received"
              }`}
          >
            <div className="chat-bubble-text">{msg.message}</div>
            {msg.createdAt && (
              <div className="chat-timestamp">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          className="chat-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
