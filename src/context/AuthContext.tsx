import { createContext, useContext, useState, type ReactNode } from 'react';

export type Role = 'employee' | 'manager' | 'projectlead' | 'unithead' | 'marketing';

interface User {
    name: string;
    email: string;
    role: Role;
    avatar: string;
    department: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: Role) => void;
    logout: () => void;
    switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<Role, User> = {
    employee: {
        name: 'Priya Sharma',
        email: 'priya.sharma@lnt.com',
        role: 'employee',
        avatar: 'PS',
        department: 'Bridge Engineering',
    },
    manager: {
        name: 'Rajesh Nair',
        email: 'rajesh.nair@lnt.com',
        role: 'manager',
        avatar: 'RN',
        department: 'Design & Engineering',
    },
    projectlead: {
        name: 'Sunita Joshi',
        email: 'sunita.joshi@lnt.com',
        role: 'projectlead',
        avatar: 'SJ',
        department: 'Infrastructure Projects',
    },
    unithead: {
        name: 'Vikram Patel',
        email: 'vikram.patel@lnt.com',
        role: 'unithead',
        avatar: 'VP',
        department: 'Engineering Division',
    },
    marketing: {
        name: 'Ananya Rao',
        email: 'ananya.rao@lnt.com',
        role: 'marketing',
        avatar: 'AR',
        department: 'Business Development',
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const login = (_email: string, _password: string, role: Role) => {
        setUser(DEMO_USERS[role]);
    };

    const logout = () => setUser(null);

    const switchRole = (role: Role) => {
        setUser(DEMO_USERS[role]);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                switchRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export { DEMO_USERS };
