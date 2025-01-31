import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const location = useLocation();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!isAdmin) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute; 