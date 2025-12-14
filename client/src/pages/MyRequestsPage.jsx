import React, { useState, useEffect } from "react";
import { getSentRequests } from "../services/api.js";
import { Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import "./MyRequestsPage.css";

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getSentRequests();
        setRequests(data);
      } catch (err) {
        setError(err.message || "Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="badge badge-success">Accepted</span>;
      case "rejected":
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-alert">{error}</div>;

  return (
    <div className="my-requests-container">
      <h2>My Sent Requests</h2>
      <p className="text-muted">Track the status of crops you want to buy.</p>

      {requests.length === 0 ? (
        <div className="no-requests-alert">
          <p>
            You haven't made any requests yet.{" "}
            <Link to="/browse">Browse Crops</Link> to find something!
          </p>
        </div>
      ) : (
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Farmer</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="crop-name">
                    {req.cropId?.title || "Unknown Crop"}
                  </td>
                  <td>
                    <div className="farmer-info">
                      <div className="farmer-name">
                        {req.farmerId?.name || "Unknown"}
                      </div>
                      <div className="farmer-location">
                        {req.farmerId?.location || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="price">₹{req.cropId?.price || "N/A"}</td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td>
                    {req.status === "accepted" ? (
                      <Link
                        to={`/dashboard/chat/${req.farmerId._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Chat Now
                      </Link>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;
