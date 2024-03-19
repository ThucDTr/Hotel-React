import React, { createContext, useContext, useState } from 'react'
import jwt_decode from "jwt-decode"
export const AuthContext = createContext({
    user: null,
    hanldeLogin: (token) => {},
    handleLogout: () => {}
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const handleLogin = (token) => {
        const decodedUser = jwt_decode(token)
        localStorage.setItem("userId", decodedUser.sub)
        localStorage.setItem("userRoles", decodedUser.roles)
        localStorage.setItem("token", token)
        setUser(decodedUser)
    }

    const handleLogout = () => {
		localStorage.removeItem("userId")
		localStorage.removeItem("userRole")
		localStorage.removeItem("token")
		setUser(null)
	}
  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    return useContext(AuthContext)
}