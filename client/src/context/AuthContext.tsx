import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
    id: number
    email: string
    username: string
    role: string
    avatar_url: string | null
    bio: string | null
    }

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isAuthenticated: boolean
    isAdmin: boolean
    }

    const AuthContext = createContext<AuthContextType | null>(null)

    export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('liminal_token')
        const storedUser = localStorage.getItem('liminal_user')
        if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = (token: string, user: User) => {
        setToken(token)
        setUser(user)
        localStorage.setItem('liminal_token', token)
        localStorage.setItem('liminal_user', JSON.stringify(user))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('liminal_token')
        localStorage.removeItem('liminal_user')
    }

    return (
        <AuthContext.Provider value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin'
        }}>
        {children}
        </AuthContext.Provider>
    )
    }

    export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
    }