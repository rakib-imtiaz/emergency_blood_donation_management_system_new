import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartPie, FaUsers, FaHandHoldingHeart, FaTint } from 'react-icons/fa';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-red-100 text-red-600' : '';
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
        navigate('/login');
    };

    return (
        <div className="w-64 bg-white h-screen shadow-lg">
            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            </div>
            
            <nav className="mt-8">
                <Link to="/admin" className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${isActive('/admin')}`}>
                    <FaChartPie className="mr-3" />
                    Dashboard
                </Link>
                
                <Link to="/admin/donors" className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${isActive('/admin/donors')}`}>
                    <FaHandHoldingHeart className="mr-3" />
                    Manage Donors
                </Link>
                
                <Link to="/admin/requests" className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${isActive('/admin/requests')}`}>
                    <FaTint className="mr-3" />
                    Manage Requests
                </Link>
                
                <Link to="/admin/users" className={`flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 ${isActive('/admin/users')}`}>
                    <FaUsers className="mr-3" />
                    Manage Users
                </Link>
            </nav>
            
            <button 
                onClick={handleLogout}
                className="w-full mt-auto px-6 py-3 text-red-600 hover:bg-red-50 text-left"
            >
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar; 