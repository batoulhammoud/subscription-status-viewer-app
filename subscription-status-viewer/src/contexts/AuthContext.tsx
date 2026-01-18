//Save user/auth in global state (Context)
//Global Auth Context is best practice because it lets you access the user anywhere without re-calling getCurrentUser().
//why? because getCurrentUser() is called once, and reused eveywhere, means faster UI

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";


export type AppUser = {
  userId: string;
  username?: string;
  email?: string;
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();

        const appUser: AppUser = {
          userId: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId,
        };

        setUser(appUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
