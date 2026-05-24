import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'technician';
  company?: string;
  avatar?: string;
}

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterUserInput) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=159AFD&color=fff`;
}

function firebaseMessage(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este email ja esta cadastrado.';
    case 'auth/invalid-email':
      return 'Email invalido.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email ou senha incorretos.';
    case 'auth/network-request-failed':
      return 'Falha de rede ao conectar com o Firebase.';
    default:
      return 'Nao foi possivel concluir a operacao.';
  }
}

async function readUserProfile(uid: string, fallbackEmail: string | null, fallbackName: string | null): Promise<User> {
  const profileRef = doc(db, 'users', uid);
  const profile = await getDoc(profileRef);

  if (profile.exists()) {
    const data = profile.data();
    return {
      id: uid,
      name: String(data.name || fallbackName || 'Usuario'),
      email: String(data.email || fallbackEmail || ''),
      role: (data.role || 'client') as User['role'],
      company: data.company ? String(data.company) : undefined,
      avatar: data.avatar ? String(data.avatar) : avatarUrl(String(data.name || fallbackName || 'Usuario')),
    };
  }

  const newProfile: User = {
    id: uid,
    name: fallbackName || 'Usuario',
    email: fallbackEmail || '',
    role: 'client',
    company: 'ELN Technology',
    avatar: avatarUrl(fallbackName || fallbackEmail || 'Usuario'),
  };

  await setDoc(profileRef, {
    ...newProfile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newProfile;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await readUserProfile(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName);
        setUser(profile);
      } catch {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuario',
          email: firebaseUser.email || '',
          role: 'client',
          company: 'ELN Technology',
          avatar: avatarUrl(firebaseUser.displayName || firebaseUser.email || 'Usuario'),
        });
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await readUserProfile(
        credential.user.uid,
        credential.user.email,
        credential.user.displayName,
      );
      setUser(profile);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterUserInput) => {
    setIsLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const avatar = avatarUrl(data.name);

      await updateProfile(credential.user, {
        displayName: data.name,
        photoURL: avatar,
      });
      await sendEmailVerification(credential.user);

      const profile: User = {
        id: credential.user.uid,
        name: data.name,
        email: data.email,
        role: 'client',
        company: data.company || 'ELN Technology',
        avatar,
      };

      await setDoc(doc(db, 'users', credential.user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setUser(profile);
      return { success: true };
    } catch (error) {
      return { success: false, message: firebaseMessage(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Enviamos um email para redefinir sua senha.' };
    } catch (error) {
      return { success: false, message: firebaseMessage(error) };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, resetPassword, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
