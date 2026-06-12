import { createContext, useContext, useState } from 'react';


type User = {
  id: number;
  username: string;
  email: string;
  role: string;
} | null;

const AuthContext = createContext({
  isConnected: false,
  user: null as User,
  login: (_user: User) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isConnected, setIsConnected] = useState(!!localStorage.getItem('accessToken'));

  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem('User');
    return raw ? JSON.parse(raw) : null;
  });

  function login(userData: User) {
    setIsConnected(true);
    setUser(userData);
    localStorage.setItem('User', JSON.stringify(userData));
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('User');
    setIsConnected(false);
    setUser(null)
  }

  return <AuthContext.Provider value={{ isConnected, user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
