import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null); 
export default AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('token')|| null);
    const [user, setUser]= useState(JSON.parse(localStorage.getItem('user') || null));
    const login = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data)
    }
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };
    return(
        <AuthContext.prototype value={{
            user,
            token,
            isAuthenticated: !!token,
            isAdmin: user?.role === 'ADMIN',
            login,
            logout,
        }}>
            {children}
        </AuthContext.prototype>
    );
}
export const useAuth = () => useContext(AuthContext);


