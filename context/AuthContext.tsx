'use client'

import { getUser } from "@/actions/auth/get-user";
import { User } from "@/interfaces/user"
import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextType {
    user: User | null;
    loading: boolean
    getUserData: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getUserData = async () => {
        setLoading(true);
        try {
            const userData = await getUser();
            if (userData) {
                setUser(userData);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const authState = async () => {
        const supabase = createClient();

        supabase.auth.onAuthStateChange((event, session) => {

            const eventTypes = [
                'INITIAL_SESSION',
                'USER_UPDATED',
                'TOKEN_REFRESHED',
                'SIGNED_IN',
                'SIGNED_OUT']

            if (eventTypes.includes(event)) {
                if (session) {
                    getUserData();
                } else {
                    setUser(null);
                }
            }

        });
    }

    useEffect(() => {
        authState();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, getUserData}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}