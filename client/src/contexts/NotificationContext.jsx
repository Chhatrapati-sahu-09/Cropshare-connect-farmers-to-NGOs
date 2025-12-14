import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
  getUnreadRequestCount,
  getUnreadMessageCount,
} from "../services/api.js";
import socket from "../services/socket.js";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [unreadRequests, setUnreadRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Function to fetch all counts
  const fetchCounts = useCallback(async () => {
    if (!isLoggedIn || !user) {
      setUnreadRequests(0);
      setUnreadMessages(0);
      return;
    }

    // Fetch Request Count (Farmer only)
    if (user.role === "farmer") {
      try {
        const { count } = await getUnreadRequestCount();
        setUnreadRequests(count);
      } catch (error) {
        console.error("Failed to fetch unread requests:", error);
      }
    } else {
      setUnreadRequests(0); // NGOs don't have requests
    }

    // Fetch Message Count (Both roles)
    try {
      const { count } = await getUnreadMessageCount();
      setUnreadMessages(count);
    } catch (error) {
      console.error("Failed to fetch unread messages:", error);
    }
  }, [isLoggedIn, user]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchCounts(); // Fetch on component mount or user change

    const interval = setInterval(fetchCounts, 60000); // Refresh every minute
    return () => clearInterval(interval); // Cleanup
  }, [fetchCounts]);

  // Listen for real-time new messages via Socket.io
  useEffect(() => {
    if (isLoggedIn && user) {
      socket.on("receive_message", (msg) => {
        // If the message is for *me* and it hasn't been read, increment
        if (msg.receiverId === user._id && !msg.read) {
          setUnreadMessages((prev) => prev + 1);
        }
      });
    }
    return () => {
      socket.off("receive_message");
    };
  }, [isLoggedIn, user]);

  return (
    <NotificationContext.Provider
      value={{ unreadRequests, unreadMessages, fetchCounts }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
