import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import axiosInstance from '../config/axios.config';

const useAdmin = () => {
    const { user } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                if (user?.email) {
                    const response = await axiosInstance.get(`/users/admin/${user.email}`);
                    console.log('Admin check response:', response.data);
                    setIsAdmin(response.data.admin);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
            } finally {
                setIsAdminLoading(false);
            }
        };
        checkAdmin();
    }, [user]);

    return [isAdmin, isAdminLoading];
};

export default useAdmin; 