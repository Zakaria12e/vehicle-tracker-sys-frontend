import { createContext, useContext, useEffect, useState } from "react";
import { useLocation , useNavigate  } from "react-router-dom";
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
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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

const navigate = useNavigate();

const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    localStorage.removeItem("token");
    if (socket.connected) {
      socket.disconnect();
    }
    setUser(null);
    navigate("/login");

    setTimeout(() => {
      window.location.reload();
    }, 1);
  } catch (err) {
    console.error("Logout failed", err);
  }
};


  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
