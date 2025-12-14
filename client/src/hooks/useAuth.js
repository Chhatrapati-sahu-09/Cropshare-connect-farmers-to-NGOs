import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import the context

// This is the custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};