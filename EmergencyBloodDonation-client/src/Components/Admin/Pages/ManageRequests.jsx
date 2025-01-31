import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaHospital, FaExclamationTriangle } from 'react-icons/fa';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBloodType, setFilterBloodType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterUrgency, setFilterUrgency] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            const response = await axios.get('/admin/requests', {
                params: { email: adminEmail }
            });
            setRequests(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load blood requests');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load blood requests'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            const result = await Swal.fire({
                title: 'Update Status',
                text: `Are you sure you want to mark this request as ${newStatus}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, update it'
            });

            if (result.isConfirmed) {
                const adminEmail = localStorage.getItem('adminEmail');
                console.log('Sending update request:', {
                    requestId,
                    newStatus,
                    adminEmail
                });

                const response = await axios.patch(`/admin/requests/${requestId}/status`, {
                    status: newStatus
                }, {
                    params: { email: adminEmail }
                });

                console.log('Server response:', response.data);

                if (response.data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Request status has been updated.',
                        timer: 1500
                    });
                    fetchRequests();
                } else {
                    throw new Error(response.data.message || 'Update failed');
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
            console.error('Full error object:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update request status'
            });
        }
    };

    const handleUrgencyUpdate = async (requestId, urgency) => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            await axios.patch(`/admin/requests/${requestId}/urgency`, {
                urgency
            }, {
                params: { email: adminEmail }
            });
            
            Swal.fire({
                icon: 'success',
                title: 'Updated',
                text: 'Urgency level updated successfully',
                timer: 1500,
                showConfirmButton: false
            });
            
            fetchRequests();
        } catch (error) {
            console.error('Error updating urgency:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update urgency level'
            });
        }
    };

    const handleDeleteRequest = async (requestId) => {
        try {
            const result = await Swal.fire({
                title: 'Delete Request?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const adminEmail = localStorage.getItem('adminEmail');
                await axios.delete(`/admin/requests/${requestId}`, {
                    params: { email: adminEmail }
                });
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Request has been deleted.',
                    timer: 1500
                });
                
                fetchRequests();
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to delete request'
            });
        }
    };

    const filteredRequests = requests.filter(request => {
        const matchesSearch = 
            request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBloodType = filterBloodType === 'all' || request.bloodType === filterBloodType;
        const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
        const matchesUrgency = filterUrgency === 'all' || request.urgency === filterUrgency;
        return matchesSearch && matchesBloodType && matchesStatus && matchesUrgency;
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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Blood Request Management</h1>
                <p className="text-gray-600">Monitor and manage blood donation requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Total Requests</p>
                            <h3 className="text-4xl font-bold">{requests.length}</h3>
                        </div>
                        <div className="text-5xl opacity-80">📊</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Pending</p>
                            <h3 className="text-4xl font-bold">
                                {requests.filter(r => r.status === 'pending').length}
                            </h3>
                        </div>
                        <div className="text-5xl opacity-80">⏳</div>
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
                            <p className="text-lg opacity-90">Fulfilled</p>
                            <h3 className="text-4xl font-bold">
                                {requests.filter(r => r.status === 'fulfilled').length}
                            </h3>
                        </div>
                        <div className="text-5xl opacity-80">✅</div>
                    </div>
                </motion.div>
            </div>

            {/* Search and Filters */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                className="input input-bordered w-full pl-12 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <select 
                            className="select select-bordered rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            value={filterBloodType}
                            onChange={(e) => setFilterBloodType(e.target.value)}
                        >
                            <option value="all">All Blood Types</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        <select 
                            className="select select-bordered rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select 
                            className="select select-bordered rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                            value={filterUrgency}
                            onChange={(e) => setFilterUrgency(e.target.value)}
                        >
                            <option value="all">All Urgency</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Requests Table */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Patient Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Blood Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Hospital</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Urgency</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.map((request) => (
                                <motion.tr 
                                    key={request._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{request.patientName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {request.bloodType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-700">
                                            <FaHospital className="mr-2 text-gray-400" />
                                            {request.hospital}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{request.phone}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            className={`select select-sm rounded-full px-3 py-1 text-sm font-medium
                                                ${request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                                  request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                  'bg-green-100 text-green-800'}`}
                                            value={request.urgency || 'medium'}
                                            onChange={(e) => handleUrgencyUpdate(request._id, e.target.value)}
                                        >
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                            ${request.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 
                                              request.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                              'bg-yellow-100 text-yellow-800'}`}>
                                            {request.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(request._id, 'fulfilled')}
                                                className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none rounded-lg"
                                                disabled={request.status === 'fulfilled'}
                                            >
                                                <FaCheckCircle className="mr-1" />
                                                Fulfill
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(request._id, 'cancelled')}
                                                className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none rounded-lg"
                                                disabled={request.status === 'cancelled'}
                                            >
                                                <FaTimesCircle className="mr-1" />
                                                Cancel
                                            </button>
                                        </div>
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

export default ManageRequests; 