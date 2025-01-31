import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FaSearch, FaUserShield, FaUserCog, FaTrash, FaUserAlt, FaPhone } from 'react-icons/fa';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            const response = await axios.get('/admin/users', {
                params: { email: adminEmail }
            });
            setUsers(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load users'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const result = await Swal.fire({
                title: `Make ${newRole}?`,
                text: `This will change user's role to ${newRole}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update role'
            });

            if (result.isConfirmed) {
                const adminEmail = localStorage.getItem('adminEmail');
                await axios.patch(`/admin/users/${userId}/role`, {
                    role: newRole
                }, {
                    params: { email: adminEmail }
                });

                await Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'User role has been updated.',
                    timer: 1500
                });

                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating role:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update user role'
            });
        }
    };

    const handleDelete = async (userId) => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            
            // Don't allow deleting if no admin email
            if (!adminEmail) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Admin authentication required'
                });
                return;
            }

            const result = await Swal.fire({
                title: 'Delete User?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete!'
            });

            if (result.isConfirmed) {
                console.log('Attempting to delete user:', { userId, adminEmail });

                const response = await axios.delete(`/admin/users/${userId}`, {
                    params: { email: adminEmail }
                });

                console.log('Delete response:', response.data);

                if (response.data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: response.data.message || 'User has been deleted.',
                        timer: 1500
                    });
                    
                    // Refresh the user list
                    await fetchUsers();
                } else {
                    throw new Error(response.data.message || 'Failed to delete user');
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            
            // Show specific error message from server if available
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user';
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
                <p className="text-gray-600">Monitor and manage system users</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Total Users</p>
                            <h3 className="text-4xl font-bold">{users.length}</h3>
                        </div>
                        <FaUserAlt className="text-4xl opacity-80" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Admins</p>
                            <h3 className="text-4xl font-bold">
                                {users.filter(u => u.role === 'admin').length}
                            </h3>
                        </div>
                        <FaUserShield className="text-4xl opacity-80" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Regular Users</p>
                            <h3 className="text-4xl font-bold">
                                {users.filter(u => u.role !== 'admin').length}
                            </h3>
                        </div>
                        <FaUserCog className="text-4xl opacity-80" />
                    </div>
                </motion.div>
            </div>

            {/* Search and Filters */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="input input-bordered w-full pl-12 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <select 
                            className="select select-bordered rounded-lg"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Users Table */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>User</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <motion.tr 
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                                                    <span className="text-xl">{user.name?.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm opacity-50">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <FaPhone className="mr-2 text-gray-400" />
                                            {user.phone || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <select 
                                            className={`select select-sm rounded-full
                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                                'bg-blue-100 text-blue-800'}`}
                                            value={user.role || 'user'}
                                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="btn btn-error btn-sm"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default ManageUsers; 