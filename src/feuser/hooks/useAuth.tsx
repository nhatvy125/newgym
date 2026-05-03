import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/api/api";

interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export interface Profile {
  id?: number;
  username?: string;
  email: string;
  fullName: string;
  role?: string;
  status?: string;
  phone?: string;
  address?: string;
  branch?: string;
  memberId?: string;
  avatarUrl?: string;
  gymPackage?: string;
  expiryDate?: string;
  groupSessions?: number;
  ptSessions?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: { access_token: string } | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  logout: () => {},
});

function decodeJwt(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      // BE: GET /api/auth/me -> UserResponse
      const data = await api.get<Profile>("/users/me");
      setProfile(data);
      setUser((prev) =>
        prev
          ? { ...prev, email: data.email || prev.email, fullName: data.fullName || prev.fullName, username: data.username }
          : prev
      );
    } catch (e) {
      console.warn("fetchProfile failed:", e);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSession(null); setUser(null); setProfile(null); setLoading(false);
      return;
    }

    const payload = decodeJwt(token);
    if (payload?.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      setSession(null); setUser(null); setProfile(null); setLoading(false);
      return;
    }

    setSession({ access_token: token });
    setUser({
      id: String(payload?.sub ?? payload?.userId ?? payload?.id ?? "unknown"),
      email: payload?.email,
      username: payload?.username,
      fullName: payload?.fullName ?? payload?.name,
      role: payload?.role ?? payload?.roles,
    });

    await fetchProfile();
    setLoading(false);
  }, [fetchProfile]);

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
  };

  useEffect(() => {
    checkAuth();
    const handler = () => checkAuth();
    window.addEventListener("storage", handler);
    window.addEventListener("auth-changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("auth-changed", handler);
    };
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, refreshProfile: fetchProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
