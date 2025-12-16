import axios from "axios";

// 1. Create a re-usable axios instance
// This instance will have the backend URL and will send cookies
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Use env or fallback to /api for monorepo
  withCredentials: true, // This is crucial for sending cookies!
});

// Helper to normalize errors coming from axios so calling code
// can safely read `.message` or other fields without crashing.
const handleApiError = (error) => {
  if (error && error.response && error.response.data) return error.response.data;
  return { message: error?.message || "Network Error" };
};

// 2. Function to handle user registration
export const registerUser = async (userData) => {
  try {
    // Make the POST request to the /users/register endpoint
    const { data } = await api.post("/users/register", userData);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 3. Function to handle user login
export const loginUser = async (loginData) => {
  try {
    // Make the POST request to the /users/login endpoint
    const { data } = await api.post("/users/login", loginData);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 5. Function to get only the logged-in user's crops
export const getMyCrops = async () => {
  try {
    // The 'protect' middleware will find the user ID from the cookie
    const { data } = await api.get("/crops/mycrops");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 4. Function to add a new crop
export const addCrop = async (cropData) => {
  try {
    const { data } = await api.post("/crops", cropData);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 6. Function to delete a crop
export const deleteCrop = async (cropId) => {
  try {
    // Make the DELETE request
    // The 'protect' and 'checkRole' middleware will run on the server
    const { data } = await api.delete(`/crops/${cropId}`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 7. Function to get a single crop by ID
export const getCropById = async (cropId) => {
  try {
    const { data } = await api.get(`/crops/${cropId}`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 9. Function for an NGO to make a request
export const makeRequest = async (cropId) => {
  try {
    const { data } = await api.post("/requests", { cropId });
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 10. Function for a farmer to get their requests
export const getReceivedRequests = async () => {
  try {
    const { data } = await api.get("/requests/received");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 11. Function to get the user's own profile
export const getUserProfile = async () => {
  try {
    const { data } = await api.get("/users/profile");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 12. Function to update the user's profile
export const updateUserProfile = async (profileData) => {
  try {
    const { data } = await api.put("/users/profile", profileData);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 13. Function to get all public, approved crops
// Now accepts a filters object
export const getAllCrops = async (filters) => {
  try {
    // Axios will automatically turn the 'params' object into
    // query parameters, e.g., /api/crops?category=Grains
    const { data } = await api.get("/crops", { params: filters });
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 14. Update Request Status (Accept/Reject)
export const updateRequestStatus = async (requestId, status) => {
  try {
    const { data } = await api.put(`/requests/${requestId}`, { status });
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 15. Get Chat List (Messages based conversations)
export const getChatList = async () => {
  try {
    const { data } = await api.get("/messages/conversations");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 16. Function to upload an image
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    // Note: 'Content-Type': 'multipart/form-data' is handled automatically by axios when passing FormData
    const { data } = await api.post("/upload", formData);
    return data.imageUrl; // Return just the URL string
  } catch (error) {
    throw handleApiError(error);
  }
};

// 17. Get unread request count (for farmers)
export const getUnreadRequestCount = async () => {
  try {
    const { data } = await api.get("/requests/unread-count");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 18. Get unread message count (for all users)
export const getUnreadMessageCount = async () => {
  try {
    const { data } = await api.get("/messages/unread-count");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 19. Function for an NGO to see their sent requests
export const getSentRequests = async () => {
  try {
    const { data } = await api.get("/requests/sent");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 20. Function to get nearby crops based on geolocation
export const getCropsNearby = async (lat, lng, dist = 50) => {
  try {
    const { data } = await api.get(
      `/crops/nearby?lat=${lat}&lng=${lng}&dist=${dist}`
    );
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 21. Function to get list of NGOs
export const getAllNGOs = async () => {
  try {
    const { data } = await api.get("/users/ngos");
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

// 22. Function to mark all messages from a specific user as read
export const markMessagesAsRead = async (senderId) => {
  try {
    const { data } = await api.put(`/messages/mark-read/${senderId}`);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

// 23. Function to get NGO ecosystem data (connected farmers, requests, etc.)
export const getNGOEcosystem = async () => {
  try {
    const { data } = await api.get("/users/ecosystem");
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

// 24. Function to get nearby NGOs (for collaboration)
export const getNearbyNGOs = async (latitude, longitude, radius = 50) => {
  try {
    const { data } = await api.get("/users/nearby-ngos", {
      params: { latitude, longitude, radius },
    });
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export default api;

// Pickup-related API helpers
export const createPickup = async (payload) => {
  try {
    const { data } = await api.post("/pickups", payload);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPickupsForFarmer = async () => {
  try {
    const { data } = await api.get("/pickups/for-farmer");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPickupsForNGO = async () => {
  try {
    const { data } = await api.get("/pickups/for-ngo");
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePickupStatus = async (pickupId, status) => {
  try {
    const { data } = await api.put(`/pickups/${pickupId}`, { status });
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get public user by id
export const getUserById = async (userId) => {
  try {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};
