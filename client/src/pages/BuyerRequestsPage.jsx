import React, { useState, useEffect } from "react";
import { getReceivedRequests, updateRequestStatus } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import "./BuyerRequestsPage.css";

const BuyerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getReceivedRequests();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // ✅ ADD THIS FUNCTION
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateRequestStatus(id, newStatus);
      // Refresh UI instantly
      setRequests(
        requests.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert("Failed to update status: " + (err.message || "Unknown error"));
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="requests-container">
      <h2>Incoming Requests from NGOs</h2>
      {requests.length === 0 ? (
        <p>You have not received any requests yet.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>NGO</th>
              <th>Crop</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>
                  {req.buyerId?.name || "N/A"} ({req.buyerId?.email || "N/A"})
                </td>
                <td>{req.cropId?.title || "N/A"}</td>
                <td>
                  <span className={`status status-${req.status}`}>
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "pending" ? (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(req._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(req._id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`badge badge-${
                        req.status === "accepted" ? "success" : "secondary"
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BuyerRequestsPage;
