import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FaSearch, FaUserPlus, FaUserMinus, FaTint, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const ManageDonors = () => {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBloodType, setFilterBloodType] = useState('all');
    const [filterAvailability, setFilterAvailability] = useState('all');
    const [selectedDonors, setSelectedDonors] = useState([]);

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            const response = await axios.get('/admin/donors', {
                params: { email: adminEmail }
            });
            setDonors(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (error) {
            console.error('Error fetching donors:', error);
            setError('Failed to load donors');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load donors'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityUpdate = async (donorId, newStatus) => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            await axios.patch(`/admin/donors/${donorId}/availability`, {
                status: newStatus
            }, {
                params: { email: adminEmail }
            });

            Swal.fire({
                icon: 'success',
                title: 'Updated',
                text: 'Donor availability updated successfully',
                timer: 1500
            });

            fetchDonors();
        } catch (error) {
            console.error('Error updating availability:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update availability'
            });
        }
    };

    const handleBulkAction = async (action) => {
        if (!selectedDonors.length) {
            Swal.fire('Info', 'Please select donors first', 'info');
            return;
        }

        try {
            const result = await Swal.fire({
                title: `Confirm ${action}`,
                text: `Are you sure you want to ${action} the selected donors?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Yes, ${action}`,
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                const adminEmail = localStorage.getItem('adminEmail');
                await axios.post(`/admin/donors/bulk-${action}`, {
                    donorIds: selectedDonors
                }, {
                    params: { email: adminEmail }
                });

                Swal.fire('Success', `Donors have been ${action}ed`, 'success');
                setSelectedDonors([]);
                fetchDonors();
            }
        } catch (error) {
            console.error(`Error in bulk ${action}:`, error);
            Swal.fire('Error', `Failed to ${action} donors`, 'error');
        }
    };

    const filteredDonors = donors.filter(donor => {
        const matchesSearch = 
            donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donor.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBloodType = filterBloodType === 'all' || donor.bloodType === filterBloodType;
        const matchesAvailability = filterAvailability === 'all' || donor.status === filterAvailability;
        return matchesSearch && matchesBloodType && matchesAvailability;
    });

    const bloodTypeStats = donors.reduce((acc, donor) => {
        acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
        return acc;
    }, {});

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
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Donor Management</h1>
                <p className="text-gray-600">Monitor and manage blood donors</p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-lg opacity-90">Total Donors</p>
                            <h3 className="text-4xl font-bold">{donors.length}</h3>
                        </div>
                        <FaUserPlus className="text-4xl opacity-80" />
                    </div>
                </motion.div>

                {/* Blood Type Distribution Cards */}
                {Object.entries(bloodTypeStats).map(([bloodType, count], index) => (
                    <motion.div
                        key={bloodType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500">Blood Type {bloodType}</p>
                                <h3 className="text-3xl font-bold text-red-600">{count}</h3>
                            </div>
                            <FaTint className="text-4xl text-red-500 opacity-80" />
                        </div>
                    </motion.div>
                ))}
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
                                placeholder="Search donors..."
                                className="input input-bordered w-full pl-12 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <select 
                            className="select select-bordered rounded-lg"
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
                            className="select select-bordered rounded-lg"
                            value={filterAvailability}
                            onChange={(e) => setFilterAvailability(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Bulk Actions */}
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => handleBulkAction('deactivate')}
                    className="btn btn-warning btn-sm"
                    disabled={!selectedDonors.length}
                >
                    <FaUserMinus className="mr-2" />
                    Deactivate Selected
                </button>
            </div>

            {/* Donors Table */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th>
                                    <input 
                                        type="checkbox"
                                        className="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedDonors(filteredDonors.map(d => d._id));
                                            } else {
                                                setSelectedDonors([]);
                                            }
                                        }}
                                    />
                                </th>
                                <th>Name</th>
                                <th>Blood Type</th>
                                <th>Location</th>
                                <th>Contact</th>
                                <th>Last Donation</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonors.map((donor) => (
                                <motion.tr 
                                    key={donor._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td>
                                        <input 
                                            type="checkbox"
                                            className="checkbox"
                                            checked={selectedDonors.includes(donor._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDonors([...selectedDonors, donor._id]);
                                                } else {
                                                    setSelectedDonors(selectedDonors.filter(id => id !== donor._id));
                                                }
                                            }}
                                        />
                                    </td>
                                    <td className="font-medium">{donor.name}</td>
                                    <td>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            {donor.bloodType}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                            {donor.location}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center">
                                            <FaPhoneAlt className="mr-2 text-gray-400" />
                                            {donor.phone}
                                        </div>
                                    </td>
                                    <td>{donor.lastDonation || 'Never'}</td>
                                    <td>
                                        <select 
                                            className={`select select-sm rounded-full
                                                ${donor.status === 'available' ? 'bg-green-100 text-green-800' : 
                                                'bg-red-100 text-red-800'}`}
                                            value={donor.status || 'available'}
                                            onChange={(e) => handleAvailabilityUpdate(donor._id, e.target.value)}
                                        >
                                            <option value="available">Available</option>
                                            <option value="unavailable">Unavailable</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleBulkAction('delete', [donor._id])}
                                            className="btn btn-error btn-sm"
                                        >
                                            Remove
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

export default ManageDonors; 