import {
  useEffect,
  createContext,
  useState,
  useContext,
  ReactElement,
} from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [currentUser, setcurrentUser] = useState<any>();

  useEffect(() => {
    supabase.auth.getSession().then((session: any) => {
      setcurrentUser(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      setcurrentUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.log(error);
    }
  };

  if (!currentUser) {
    return <button onClick={signInWithGitHub}>Login</button>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, setcurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
