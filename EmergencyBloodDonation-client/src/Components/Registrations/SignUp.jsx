import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaLocationArrow, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import Swal from "sweetalert2";
import axios from 'axios';

const SignUp = () => {
    const { createUser, updateUserProfile } = useContext(AuthContext);
    const [signUpError, setSignUpError] = useState('');
    const navigate = useNavigate();

    // Location states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Blood group state
    const [bloodType, setBloodType] = useState('');

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    // Handle location search
    const handleLocationSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle location selection
    const handleLocationSelect = (result) => {
        const newLocation = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
        };
        setSelectedLocation(newLocation);
        setSearchQuery(result.display_name);
        setSearchResults([]);
    };

    // Get current location
    const getCurrentLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Get address for the location
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}`
                        );
                        const data = await response.json();
                        setSearchQuery(data.display_name);
                        setSelectedLocation(newLocation);
                    } catch (error) {
                        console.error('Error getting address:', error);
                    }
                    
                    setIsLocating(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLocating(false);
                    Swal.fire({
                        icon: 'error',
                        title: 'Location Error',
                        text: 'Unable to get your location. Please try searching instead.'
                    });
                }
            );
        }
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;
        const password = form.password.value;

        if (!selectedLocation) {
            return Swal.fire({
                icon: "error",
                text: "Please select a location",
            });
        }

        if (!bloodType) {
            return Swal.fire({
                icon: "error",
                text: "Please select a blood group",
            });
        }

        // Phone validation
        const regex = /^01\d{9}$/;
        if (!regex.test(phone)) {
            return Swal.fire({
                icon: "error",
                text: "Invalid Contact number",
            });
        }

        setSignUpError("");

        try {
            const userCredential = await createUser(email, password);
            await updateUserProfile(name);

            const userData = {
                email,
                displayName: name,
                phoneNumber: phone,
                totalDonations: 0,
                lastDonationDate: null,
                createdAt: new Date().toISOString(),
                bloodType,
                location: selectedLocation,
                address: searchQuery
            };

            const response = await axios.put(
                `http://localhost:5000/user/${email}`,
                userData
            );

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: "Your account has been created successfully.",
                });
                navigate('/login');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setSignUpError(error.message);
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: error.message,
            });
        }
    };

    return (
        <div className="hero mt-5 bg-gradient-to-r from-white via-red-100 to-red-50">
            <div className="hero-content flex-col">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold mb-8 text-red-500">Register now!</h1>
                </div>
                <div className="card border border-red-300 p-8">
                    <form onSubmit={handleSignUp} className="card-body mx-auto">
                        {/* Existing fields */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" name='name' placeholder="username" className="input input-bordered md:w-96" required />
                        </div>

                        {/* Blood Group Selection */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Blood Group</span>
                            </label>
                            <select 
                                value={bloodType}
                                onChange={(e) => setBloodType(e.target.value)}
                                className="select select-bordered md:w-96"
                                required
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location Search */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                                    placeholder="Search location..."
                                    className="input input-bordered md:w-96 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleLocationSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                >
                                    <FaSearch className={isSearching ? 'animate-spin' : ''} />
                                </button>

                                {/* Location Search Results */}
                                <AnimatePresence>
                                    {searchResults.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto"
                                        >
                                            {searchResults.map((result, index) => (
                                                <motion.button
                                                    key={index}
                                                    type="button"
                                                    whileHover={{ backgroundColor: '#f7f7f7' }}
                                                    onClick={() => handleLocationSelect(result)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <FaMapMarkerAlt className="text-red-400" />
                                                    <span className="text-sm text-gray-600">{result.display_name}</span>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Get Current Location Button */}
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isLocating}
                                className="btn btn-outline btn-error mt-2"
                            >
                                <FaLocationArrow className={isLocating ? 'animate-spin' : ''} />
                                {isLocating ? 'Getting Location...' : 'Get My Location'}
                            </button>
                        </div>

                        {/* Other existing fields */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone</span>
                            </label>
                            <input type="text" name='phone' placeholder="phone number" className="input input-bordered md:w-96" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" name='email' placeholder="email" className="input input-bordered md:w-96" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" name='password' placeholder="password" className="input input-bordered md:w-96" required />
                        </div>

                        {signUpError && <p className="text-red-500 text-lg font-medium w-2/3">{signUpError}</p>}

                        <div className="form-control mt-6">
                            <button className="btn bg-red-500 hover:bg-red-400 text-white">Sign Up</button>
                        </div>
                        <p>Already have an Account? Please <Link className="text-blue-500" to='/login'>Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
