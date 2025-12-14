import { useContext } from "react";
import NotificationContext from "../contexts/NotificationContext.jsx";

export const useNotifications = () => useContext(NotificationContext);
