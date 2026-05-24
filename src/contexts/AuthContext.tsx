import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
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
  role: User['role'];
  company?: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterUserInput) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sessionStorageKey = 'user';
const usersStorageKey = 'eln-users';

const demoUsers: StoredUser[] = [
  {
    id: '1',
    name: 'Joao Silva',
    email: 'cliente@empresa.com',
    password: '123456',
    role: 'client',
    company: 'TechCorp Ltda',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: '2',
    name: 'Admin ELN',
    email: 'admin@elntechnology.com',
    password: '123456',
    role: 'admin',
    company: 'ELN Technology',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: '3',
    name: 'Carlos Tecnico',
    email: 'tecnico@elntechnology.com',
    password: '123456',
    role: 'technician',
    company: 'ELN Technology',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function publicUser(user: StoredUser): User {
  const { password, ...safeUser } = user;
  return safeUser;
}

function readStoredUser(): User | null {
  try {
    if (!canUseLocalStorage()) {
      return null;
    }

    const storedUser = window.localStorage.getItem(sessionStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user: User) {
  try {
    window.localStorage?.setItem(sessionStorageKey, JSON.stringify(user));
  } catch {
    // Login should still work in restricted/private browser contexts.
  }
}

function clearStoredUser() {
  try {
    window.localStorage?.removeItem(sessionStorageKey);
  } catch {
    // Logout should still clear the in-memory session.
  }
}

function readUsers(): StoredUser[] {
  try {
    if (!canUseLocalStorage()) {
      return demoUsers;
    }

    const storedUsers = window.localStorage.getItem(usersStorageKey);

    if (!storedUsers) {
      window.localStorage.setItem(usersStorageKey, JSON.stringify(demoUsers));
      return demoUsers;
    }

    return JSON.parse(storedUsers);
  } catch {
    return demoUsers;
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    window.localStorage?.setItem(usersStorageKey, JSON.stringify(users));
  } catch {
    // Local demo accounts are best-effort until a real database exists.
  }
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return Date.now().toString();
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
    readUsers();
    const storedUser = readStoredUser();

    if (storedUser) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = readUsers().find((account) => account.email.toLowerCase() === email.toLowerCase());

    if (foundUser && foundUser.password === password) {
      const safeUser = publicUser(foundUser);
      setUser(safeUser);
      writeStoredUser(safeUser);
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterUserInput) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = readUsers();
    const alreadyExists = users.some((account) => account.email.toLowerCase() === data.email.toLowerCase());

    if (alreadyExists) {
      setIsLoading(false);
      return { success: false, message: 'Este email ja esta cadastrado.' };
    }

    const newUser: StoredUser = {
      id: createId(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      company: data.company || 'ELN Technology',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=159AFD&color=fff`,
    };

    writeUsers([...users, newUser]);

    const safeUser = publicUser(newUser);
    setUser(safeUser);
    writeStoredUser(safeUser);
    setIsLoading(false);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    clearStoredUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
