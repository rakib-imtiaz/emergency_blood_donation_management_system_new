import React, { useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Logout = () => {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            Swal.fire({
                icon: 'success',
                title: 'Logged Out!',
                text: 'You have been successfully logged out.'
            });
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to logout. Please try again.'
            });
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-white hover:bg-red-700 transition-colors"
        >
            Logout
        </button>
    );
};

export default Logout;
