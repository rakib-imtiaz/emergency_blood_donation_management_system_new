import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUsers, FaHandHoldingHeart, FaTint, FaChartLine } from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDonors: 0,
        totalRequests: 0,
        recentActivity: [],
        bloodTypeStats: [],
        monthlyStats: [],
        requestStatus: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const adminEmail = localStorage.getItem('adminEmail');
            const response = await axios.get('/admin/dashboard-stats', {
                params: { email: adminEmail }
            });
            setStats(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setError('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    // Colors for pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600">
                <p>{error}</p>
                <button onClick={fetchStats} className="mt-4 btn btn-sm btn-error">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Users',
                        value: stats.totalUsers,
                        icon: FaUsers,
                        color: 'blue',
                        increase: '+12%'
                    },
                    {
                        title: 'Total Donors',
                        value: stats.totalDonors,
                        icon: FaHandHoldingHeart,
                        color: 'green',
                        increase: '+5%'
                    },
                    {
                        title: 'Blood Requests',
                        value: stats.totalRequests,
                        icon: FaTint,
                        color: 'red',
                        increase: '+8%'
                    },
                    {
                        title: 'Success Rate',
                        value: '85%',
                        icon: FaChartLine,
                        color: 'purple',
                        increase: '+3%'
                    }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500">{item.title}</p>
                                <h2 className="text-3xl font-bold">{item.value}</h2>
                                <p className={`text-${item.color}-500 text-sm`}>
                                    {item.increase} from last month
                                </p>
                            </div>
                            <item.icon className={`text-4xl text-${item.color}-500`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Monthly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.monthlyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area 
                                    type="monotone" 
                                    dataKey="donations" 
                                    stackId="1"
                                    stroke="#82ca9d" 
                                    fill="#82ca9d" 
                                    name="Donations"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="requests" 
                                    stackId="1"
                                    stroke="#8884d8" 
                                    fill="#8884d8" 
                                    name="Requests"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Blood Type Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    <h3 className="text-lg font-semibold mb-4">Blood Type Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.bloodTypeStats}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.bloodTypeStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-md mt-6"
            >
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Activity</th>
                                <th>User</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentActivity.map((activity, index) => (
                                <tr key={index}>
                                    <td>{activity.time}</td>
                                    <td>{activity.action}</td>
                                    <td>{activity.user}</td>
                                    <td>
                                        <span className={`badge badge-${activity.status === 'completed' ? 'success' : 'warning'}`}>
                                            {activity.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard; 