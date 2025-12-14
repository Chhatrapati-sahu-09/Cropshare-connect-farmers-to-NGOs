import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getChatList, markMessagesAsRead } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import NotificationContext from "../contexts/NotificationContext.jsx";
import { useContext } from "react";
import { FaComment, FaArrowRight } from "react-icons/fa";
import "./MessagesList.css";

const MessagesList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCounts } = useContext(NotificationContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChatList();
        setConversations(data);

        // Mark all unread messages as read when opening MessagesList
        if (data && data.length > 0) {
          for (const conv of data) {
            try {
              await markMessagesAsRead(conv._id);
            } catch (err) {
              console.error(
                `Failed to mark messages from ${conv._id} as read`,
                err
              );
            }
          }
          // Refresh the notification count after marking as read
          if (fetchCounts) {
            fetchCounts();
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [fetchCounts]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="messages-error">
        <p>{error}</p>
      </div>
    );

  const getContactInitials = (contact) => {
    const name = contact?.organizationName || contact?.name || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="messages-container">
      {/* Header */}
      <div className="messages-header">
        <div className="header-content">
          <FaComment className="header-icon" />
          <h1>Messages</h1>
        </div>
        <p className="header-subtitle">
          {conversations.length}{" "}
          {conversations.length === 1 ? "conversation" : "conversations"}
        </p>
      </div>

      {/* Messages List */}
      <div className="messages-list-wrapper">
        {conversations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No Messages Yet</h3>
            <p>Start a conversation with a farmer or NGO to begin messaging</p>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv, index) => (
              <Link
                key={conv._id}
                to={`/dashboard/chat/${conv.otherUser._id}`}
                className="conversation-card"
              >
                {/* Avatar */}
                <div className="conv-avatar">
                  {getContactInitials(conv.otherUser)}
                </div>

                {/* Message Content */}
                <div className="conv-content">
                  <div className="conv-header">
                    <h3 className="conv-name">
                      {conv.otherUser.organizationName || conv.otherUser.name}
                    </h3>
                    <span className="conv-time">
                      {formatTime(conv.timestamp)}
                    </span>
                  </div>
                  <p className="conv-preview">
                    {conv.lastMessage
                      ? conv.lastMessage.substring(0, 60)
                      : "No messages yet"}
                    {conv.lastMessage && conv.lastMessage.length > 60
                      ? "..."
                      : ""}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="conv-action">
                  <FaArrowRight />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
