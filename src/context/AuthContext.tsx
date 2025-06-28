import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "@/lib/socket";

type User = {
  id: string;
  name: string;
  email: string;
  company: string;
  photo: string;
  role: string;
  alertCounter?: number;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();

  useEffect(() => {
    const excludedRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

    if (excludedRoutes.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          setUser(null);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setUser(data.data);

          if (!socket.connected) {
            socket.connect();
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [location.pathname, API_URL]);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (socket.connected) {
        socket.disconnect();
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      window.location.href = "/login"; 
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
