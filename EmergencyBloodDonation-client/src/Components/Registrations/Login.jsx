import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaUserCircle, FaLock, FaUserShield } from 'react-icons/fa';

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'

    const handleLogin = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            if (loginType === 'admin') {
                // Simple admin login
                const response = await axios.post('http://localhost:5000/admin/login', {
                    email,
                    password
                });

                if (response.data.success) {
                    // Just store admin status
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('adminEmail', email);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Welcome Admin!',
                        text: 'Successfully logged in as administrator'
                    });
                    navigate('/admin');
                }
            } else {
                // Regular user login with Firebase
                await signIn(email, password);
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: 'Successfully logged in'
                });
                navigate(location?.state?.from?.pathname || '/');
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || error.message
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-red-50 to-red-100">
            <div className="max-w-4xl w-full mx-4 flex rounded-lg shadow-2xl overflow-hidden">
                {/* Left Side - Information */}
                <div className="hidden lg:block w-1/2 bg-gradient-to-br from-red-600 to-red-800 p-12 text-white">
                    <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                    <p className="text-lg mb-8">
                        Your contribution makes a difference in saving lives through blood donation.
                    </p>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <p>Connect with blood donors</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <p>Track donation requests</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <p>Manage your donations</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 bg-white p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800">Login to Your Account</h3>
                        <p className="text-gray-600 mt-2">Please enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Login As
                                </label>
                                <div className="relative">
                                    <FaUserShield className="absolute left-3 top-3 text-gray-400" />
                                    <select 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        value={loginType}
                                        onChange={(e) => setLoginType(e.target.value)}
                                    >
                                        <option value="user">Regular User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FaUserCircle className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder="Enter your email" 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="password" 
                                        name="password" 
                                        placeholder="Enter your password" 
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                                <label className="ml-2 block text-sm text-gray-700">Remember me</label>
                            </div>
                            <a href="#" className="text-sm text-red-600 hover:text-red-800">Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            Sign In
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/signup" className="font-medium text-red-600 hover:text-red-800">
                                Sign up now
                            </Link>
                        </div>

                        {loginType === 'admin' && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="font-medium text-gray-700 mb-2">Admin Credentials:</p>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Email: admin@blood.com</p>
                                    <p>Password: admin123</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
