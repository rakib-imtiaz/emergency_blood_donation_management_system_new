import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaPhoneAlt, FaUserCircle, FaTint, FaMapMarkerAlt, FaLocationArrow, FaSyncAlt, FaDirections, FaMapMarkedAlt } from 'react-icons/fa';

// Add this new component for map control
const MapController = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, map]);
  
  return null;
};

const BloodTypeCard = ({ type, count, isSelected }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-white rounded-xl shadow-sm p-4 relative overflow-hidden group 
        ${isSelected ? 'bg-red-50' : ''}`}
    >
      <div className={`absolute -right-6 -top-6 w-16 h-16 rounded-full transition-transform duration-300
        ${isSelected ? 'bg-red-100' : 'bg-red-50'} 
        group-hover:scale-150`} 
      />
      <div className="relative z-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{type}</h3>
          <FaTint className={`text-xl ${count > 0 ? 'text-red-500' : 'text-gray-300'}`} />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {count} {count === 1 ? 'donor' : 'donors'}
        </p>
      </div>
    </motion.div>
  );
};

const DonorDetailsModal = ({ donor, onClose }) => {
  const [showDirectionOptions, setShowDirectionOptions] = useState(false);

  const handleGetCurrentLocationDirections = async () => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${donor.location.lat},${donor.location.lng}`;
        window.open(url, '_blank');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Location Error',
        text: 'Unable to get your current location'
      });
    }
  };

  const handleCustomLocationDirections = () => {
    Swal.fire({
      title: 'Select Starting Point',
      text: 'Click on the map to select your starting point',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Open Map',
      confirmButtonColor: '#EF4444'
    }).then((result) => {
      if (result.isConfirmed) {
        // Open Google Maps in selection mode
        const url = `https://www.google.com/maps/dir//${donor.location.lat},${donor.location.lng}`;
        window.open(url, '_blank');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Donor Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <FaTint className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Type</p>
              <p className="font-semibold">{donor.bloodType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-gray-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold">{donor.displayName || donor.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-gray-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold">{donor.address}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {/* Contact Button */}
          <button
            onClick={() => {
              Swal.fire({
                title: 'Contact Information',
                html: `<p class="text-lg font-semibold">${donor.phoneNumber || donor.phone}</p>`,
                icon: 'info',
                confirmButtonColor: '#EF4444'
              });
            }}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaPhoneAlt />
            Contact Donor
          </button>

          {/* Get Directions Button */}
          <div className="relative">
            <button
              onClick={() => setShowDirectionOptions(!showDirectionOptions)}
              className="w-full px-4 py-3 bg-white border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <FaDirections className="text-lg" />
              Get Directions
            </button>

            {/* Direction Options Dropdown */}
            <AnimatePresence>
              {showDirectionOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={handleGetCurrentLocationDirections}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FaLocationArrow className="text-red-500" />
                    <span>From Current Location</span>
                  </button>
                  <button
                    onClick={handleCustomLocationDirections}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 border-t"
                  >
                    <FaMapMarkedAlt className="text-red-500" />
                    <span>Choose on Map</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AvailableBloodTracker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add this new state for donor counts
  const [donorCounts, setDonorCounts] = useState({
    'A+': 0,
    'A-': 0,
    'B+': 0,
    'B-': 0,
    'AB+': 0,
    'AB-': 0,
    'O+': 0,
    'O-': 0
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter donors based on blood type
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => 
      bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter
    );
  }, [donors, bloodTypeFilter]);

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
    setUserLocation(newLocation);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  // Get current location with reverse geocoding
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
          } catch (error) {
            console.error('Error getting address:', error);
          }
          
          setUserLocation(newLocation);
          setIsLocating(false);

          // Get the map instance and update view
          const map = mapRef.current;
          if (map) {
            map.setView(
              [newLocation.lat, newLocation.lng],
              15,
              { animate: true }
            );
          }

          // Optional: Add a marker for user's location
          setUserMarker(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          Swal.fire({
            icon: 'error',
            title: 'Location Error',
            text: 'Unable to get your location. Please try searching instead.'
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setIsLocating(false);
      Swal.fire({
        icon: 'error',
        title: 'Location Not Supported',
        text: 'Your browser does not support geolocation.'
      });
    }
  };

  // Single fetchDonors function
  const fetchDonors = async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/user');
      const loggedInUserEmail = localStorage.getItem('userEmail'); // Assuming you store user email in localStorage
      
      // Filter out the logged-in user and ensure required fields exist
      const donorsWithBlood = response.data.filter(user => 
        user.bloodType && 
        user.location &&
        user.location.lat && 
        user.location.lng &&
        user.email !== loggedInUserEmail // Exclude logged-in user
      );
      
      console.log('Filtered donors:', donorsWithBlood);
      
      // Calculate counts for each blood type
      const counts = donorsWithBlood.reduce((acc, donor) => {
        const bloodType = donor.bloodType;
        if (bloodType) {  // Only count if bloodType exists
          acc[bloodType] = (acc[bloodType] || 0) + 1;
        }
        return acc;
      }, {
        'A+': 0,
        'A-': 0,
        'B+': 0,
        'B-': 0,
        'AB+': 0,
        'AB-': 0,
        'O+': 0,
        'O-': 0
      });
      
      console.log('Blood type counts:', counts);
      
      setDonorCounts(counts);
      setDonors(donorsWithBlood);
    } catch (error) {
      console.error('Error fetching donors:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Fetching Donors',
        text: 'Please check your connection and try again',
        showConfirmButton: true,
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Add error state and loading feedback
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to load donors
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDonors}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Update the refresh button component
  const refreshButton = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={fetchDonors}
      disabled={isRefreshing}
      className="ml-4 px-4 py-3 text-gray-600 hover:text-red-500 bg-white rounded-xl border border-gray-200 
      hover:border-red-500 flex items-center gap-2 transition-all duration-200 disabled:opacity-70"
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
      >
        <FaSyncAlt className={`text-lg ${isRefreshing ? 'opacity-50' : ''}`} />
      </motion.div>
      <span className="hidden md:inline">Refresh</span>
    </motion.button>
  );

  // Add these new states
  const [showDonorList, setShowDonorList] = useState(false);
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [focusedDonor, setFocusedDonor] = useState(null);
  const mapRef = useRef(null);

  // Add handler for blood type card click
  const handleBloodTypeClick = (type) => {
    setSelectedBloodType(type);
    setShowDonorList(true);
  };

  // Add handler for donor selection from list
  const handleDonorSelect = (donor) => {
    setFocusedDonor(donor);
    setShowDonorList(false);
    
    // Get the map instance from MapContainer
    const map = mapRef.current?.leafletElement;
    if (map && donor.location) {
      map.setView(
        [donor.location.lat, donor.location.lng],
        15,
        { animate: true }
      );
    }
  };

  // Add DonorListModal component
  const DonorListModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => setShowDonorList(false)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {selectedBloodType} Donors
          </h3>
          <button
            onClick={() => setShowDonorList(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {filteredDonors
            .filter(donor => donor.bloodType === selectedBloodType)
            .map((donor, index) => (
              <motion.div
                key={donor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer
                  ${focusedDonor?._id === donor._id ? 'bg-red-50' : ''}`}
                onClick={() => handleDonorSelect(donor)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {donor.bloodType}
                  </div>
                  <div>
                    <h4 className="font-semibold">{donor.name}</h4>
                    <p className="text-sm text-gray-600">{donor.address}</p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Add a user marker state and component
  const [userMarker, setUserMarker] = useState(null);

  // Update the MapContainer section
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Search Bar and Location Button */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
              placeholder="Search location..."
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={handleLocationSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaSearch className={isSearching ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="px-6 py-3 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 
              hover:bg-red-600 transition-colors disabled:opacity-70 flex-shrink-0"
            >
              <FaLocationArrow className={isLocating ? 'animate-spin' : ''} />
              <span className="hidden md:inline">
                {isLocating ? 'Getting Location...' : 'Get My Location'}
              </span>
              <span className="md:hidden">
                {isLocating ? 'Loading...' : 'My Location'}
              </span>
            </motion.button>
            {refreshButton}
          </div>
        </div>

        {/* Search Results Dropdown */}
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
      </motion.div>

      {/* Blood Type Grid with updated styling */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(donorCounts).map(([type, count], index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => count > 0 && handleBloodTypeClick(type)}
            className={`cursor-pointer ${count === 0 ? 'opacity-50' : ''}`}
          >
            <BloodTypeCard 
              type={type} 
              count={count} 
              isSelected={selectedBloodType === type}
            />
          </motion.div>
        ))}
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <MapContainer
            ref={mapRef}
            center={userLocation || [23.8103, 90.4125]}
            zoom={13}
            className="h-[600px] w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController center={focusedDonor?.location || userLocation} />
            
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `
                    <div style="
                      background-color: #3B82F6;
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-center: center;
                      color: white;
                      font-weight: bold;
                      border: 2px solid white;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    ">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16px" height="16px">
                        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                      </svg>
                    </div>
                  `,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">Your Location</h3>
                    <p className="text-sm text-gray-600">{searchQuery}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Donor Markers */}
            {filteredDonors.map((donor) => (
              <Marker
                key={donor._id}
                position={[donor.location.lat, donor.location.lng]}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `
                    <div style="
                      background-color: ${focusedDonor?._id === donor._id ? '#EF4444' : '#FF6B6B'};
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      font-weight: bold;
                      border: 2px solid white;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                      transform: ${focusedDonor?._id === donor._id ? 'scale(1.2)' : 'scale(1)'};
                      transition: transform 0.3s ease;
                    ">
                      ${donor.bloodType}
                    </div>
                  `,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                })}
                eventHandlers={{
                  click: () => setSelectedDonor(donor)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{donor.bloodType}</h3>
                    <p className="text-sm text-gray-600">{donor.name}</p>
                    <button
                      onClick={() => setSelectedDonor(donor)}
                      className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </motion.div>

      {/* Selected Donor Modal */}
      <AnimatePresence>
        {selectedDonor && (
          <DonorDetailsModal 
            donor={selectedDonor} 
            onClose={() => setSelectedDonor(null)} 
          />
        )}
      </AnimatePresence>

      {/* Add the donor list modal */}
      <AnimatePresence>
        {showDonorList && <DonorListModal />}
      </AnimatePresence>
    </div>
  );
};

export default AvailableBloodTracker;
