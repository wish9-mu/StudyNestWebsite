import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore session from localStorage if available
    const storedUser = localStorage.getItem("supabaseSession");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
        localStorage.setItem("supabaseSession", JSON.stringify(session.user));
      } else {
        setUser(null);
        localStorage.removeItem("supabaseSession");
      }

      console.log("User set to", user);

      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        localStorage.setItem("supabaseSession", JSON.stringify(session.user));
      } else {
        setUser(null);
        localStorage.removeItem("supabaseSession");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
