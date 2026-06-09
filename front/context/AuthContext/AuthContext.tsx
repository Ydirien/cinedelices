import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({ isConnected: false, logout: () => {} });

export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('accessToken'));

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('User');
    setIsConnected(false);
  }

  return (
    <AuthContext.Provider value={{ isConnected, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
