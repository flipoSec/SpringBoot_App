import { Navigate } from "react-router-dom";
import {useAuth} from '../../context/AuthContext';

export default function ProtectedRoute({children, requireAuth, requireAdmin}){
    const {isAuthenticated, isAdmin} = useAuth();

    if(requireAuth && !isAuthenticated) return <Navigate to='/login' replace/>;
    if(requireAdmin && !isAdmin) return <Navigate to='/' replace/>

    return children;
}
