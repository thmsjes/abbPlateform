import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded["AccessLevel"]; 
        console.log(userRole)
        if (allowedRole && userRole !== allowedRole) {
            // User is logged in but has the WRONG role
            // return <Navigate to="/picker" replace />;
        }

        return children;
    } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;