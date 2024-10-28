import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../providers/AuthProvider';
import { FaUserCircle, FaEdit, FaTint, FaCalendarAlt, FaPhoneAlt, FaMapMarkerAlt, FaMedal } from 'react-icons/fa';
import { RiUserHeartFill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Add this new component for map centering
const MapCenterController = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || 'User',
    phoneNumber: '',
    bloodType: '',
    email: user?.email || '',
    location: null,
    address: ''
  });
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const mapRef = useRef(null);

  // Function to create/update user
  const updateUserData = async (data) => {
    try {
      console.log('Updating user data:', data);
      
      const response = await axios.put(`http://localhost:5000/user/${user.email}`, {
        ...data,
        firebaseUid: user.uid,
        email: user.email,
        updatedAt: new Date()
      });

      console.log('Update response:', response.data);
      
      if (response.data.success) {
        return response.data.user;
      }
      throw new Error('Failed to update user data');
      
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) return;

      try {
        const response = await axios.get(`http://localhost:5000/user/${user.email}`);
        
        if (response.data.success) {
          setFormData({
            displayName: response.data.user.displayName || user.displayName || 'User',
            phoneNumber: response.data.user.phoneNumber || '',
            bloodType: response.data.user.bloodType || '',
            email: response.data.user.email || user.email,
            location: response.data.user.location || null,
            address: response.data.user.address || ''
          });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Create new user
          try {
            const createResponse = await axios.post('http://localhost:5000/user', {
              email: user.email,
              displayName: user.displayName || 'User',
              firebaseUid: user.uid,
              createdAt: new Date()
            });

            if (createResponse.data.success) {
              setFormData({
                displayName: createResponse.data.user.displayName,
                phoneNumber: '',
                bloodType: '',
                email: createResponse.data.user.email,
                location: null,
                address: ''
              });
            }
          } catch (createError) {
            console.error('Error creating user:', createError);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to create user profile'
            });
          }
        } else {
          console.error('Error fetching user:', error.response || error);
        }
      }
    };

    if (user?.email) {
      loadUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        location,
        address
      };
      
      const response = await axios.put(`http://localhost:5000/user/${user?.email}`, dataToSubmit);
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been updated successfully.'
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  // Add this component for map interaction
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
        // Reverse geocoding to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
          .then(res => res.json())
          .then(data => {
            setAddress(data.display_name);
          });
      }
    });

    return location ? (
      <Marker position={[location.lat, location.lng]} />
    ) : null;
  };

  // Real-time search function
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Separate location update from form submission
  const handleLocationSubmit = async () => {
    if (!location) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please select a location first'
      });
      return;
    }

    try {
      console.log('Submitting location update:', {
        email: user?.email,
        location,
        address
      });

      const response = await axios.put(`http://localhost:5000/user/${user?.email}`, {
        ...formData,
        location,
        address
      });
      
      console.log('Location update response:', response.data);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Location Updated!',
          text: 'Your location has been saved successfully.'
        });
      }
    } catch (error) {
      console.error('Location update error:', error.response || error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update location'
      });
    }
  };

  // Add getCurrentLocation function
  const getCurrentLocation = () => {
    setIsLoadingCurrentLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);

          // Get address for the location using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}`
            );
            const data = await response.json();
            setAddress(data.display_name);
          } catch (error) {
            console.error('Error getting address:', error);
          }

          setIsLoadingCurrentLocation(false);
          Swal.fire({
            icon: 'success',
            title: 'Location Updated!',
            text: 'Your current location has been set.'
          });
        },
        (error) => {
          setIsLoadingCurrentLocation(false);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Unable to get your current location. Please make sure location services are enabled.'
          });
        }
      );
    } else {
      setIsLoadingCurrentLocation(false);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Geolocation is not supported by your browser'
      });
    }
  };

  // Add this function to handle location selection
  const handleLocationSelect = (result) => {
    setLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon)
    });
    setAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.div 
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={itemVariants}
      >
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-red-500 to-red-600">
          <div className="absolute -bottom-16 left-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              {formData.photoURL ? (
                <img 
                  src={formData.photoURL} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-white bg-gray-300 rounded-full border-4 border-white shadow-lg" />
              )}
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <FaEdit className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-white text-red-500 rounded-full shadow-lg font-semibold flex items-center gap-2"
            >
              <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-20 px-8 pb-8">
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Personal Info Card */}
            <motion.div 
              variants={itemVariants}
              className="col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-2xl font-bold mb-6">{formData.displayName}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{formData.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaTint className="text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Type</p>
                      <p className="font-medium">{formData.bloodType || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <RiUserHeartFill className="text-red-500" />
                Donation Stats
              </h3>
              <div className="space-y-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold text-red-500"
                  >
                    {formData.totalDonations || 0}
                  </motion.div>
                  <p className="text-sm text-gray-600">Total Donations</p>
                </div>
                <div className="flex items-center justify-between">
                  <FaCalendarAlt className="text-red-500" />
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last Donation</p>
                    <p className="font-medium">{formData.lastDonationDate || 'Never'}</p>
                  </div>
                </div>
                {formData.totalDonations > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-center p-3 bg-yellow-50 rounded-lg"
                  >
                    <FaMedal className="text-yellow-500" />
                    <span className="text-sm font-medium">Active Donor</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Edit Form Section */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-6 mb-6">
                    <FaUserCircle className="w-24 h-24 text-gray-400" />
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                        placeholder="Display Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Personal Information</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Phone Number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                        <select
                          name="bloodType"
                          value={formData.bloodType}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select Blood Type</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">Donation Statistics</h4>
                      <p><strong>Total Donations:</strong> 5</p>
                      <p><strong>Last Donation:</strong> 2023-05-15</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Save Changes
                  </button>

                  {isEditing && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">Set Your Location</h4>
                      
                      <div className="space-y-4 mb-4">
                        {/* Real-time search input */}
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for a location..."
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                          />
                          {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                            </div>
                          )}
                        </div>

                        {/* Search results */}
                        {searchResults.length > 0 && (
                          <div className="mb-4 max-h-40 overflow-y-auto border rounded-lg shadow-lg">
                            {searchResults.map((result, index) => (
                              <button
                                key={index}
                                onClick={() => handleLocationSelect(result)}
                                className="w-full text-left p-2 hover:bg-gray-100 border-b last:border-b-0"
                              >
                                {result.display_name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Current location button */}
                        <button
                          onClick={getCurrentLocation}
                          disabled={isLoadingCurrentLocation}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          {isLoadingCurrentLocation ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Getting Location...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              Get Current Location
                            </>
                          )}
                        </button>
                      </div>

                      {/* Map container */}
                      <div className="h-[300px] mb-4 border rounded-lg overflow-hidden">
                        <MapContainer
                          center={location ? [location.lat, location.lng] : [23.8103, 90.4125]}
                          zoom={13}
                          style={{ height: '100%', width: '100%' }}
                          ref={mapRef}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          {location && (
                            <>
                              <Marker position={[location.lat, location.lng]} />
                              <MapCenterController center={[location.lat, location.lng]} />
                            </>
                          )}
                          <LocationMarker />
                        </MapContainer>
                      </div>

                      {/* Selected address display */}
                      {address && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Selected Address
                          </label>
                          <div className="flex gap-2 items-start">
                            <input
                              type="text"
                              value={address}
                              readOnly
                              className="flex-1 p-2 border rounded-lg bg-gray-50"
                            />
                            <button
                              onClick={() => {
                                setLocation(null);
                                setAddress('');
                              }}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              type="button"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Save location button */}
                      {location && (
                        <button
                          onClick={handleLocationSubmit}
                          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4"
                        >
                          Save Location
                        </button>
                      )}

                      {/* Instructions */}
                      <div className="text-sm text-gray-600 mt-2">
                        <p>You can set your location by:</p>
                        <ul className="list-disc ml-5">
                          <li>Searching for an address using the search bar above</li>
                          <li>Using the "Get Current Location" button</li>
                          <li>Clicking directly on the map</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Profile;
