import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../providers/AuthProvider';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import axios from 'axios';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || 'User',
    phoneNumber: user?.phoneNumber || '',
    bloodType: user?.bloodType || '',
    email: user?.email || ''
  });

  // Add this effect to fetch user data
  useEffect(() => {
    const ensureUserExists = async () => {
      try {
        // Try to fetch user
        const response = await axios.get(`http://localhost:5000/user/${user?.email}`);
        setFormData({
          displayName: response.data.displayName || user?.displayName || 'User',
          phoneNumber: response.data.phoneNumber || '',
          bloodType: response.data.bloodType || '',
          email: response.data.email || user?.email || ''
        });
      } catch (error) {
        if (error.response?.status === 404) {
          // User doesn't exist in MongoDB, create them
          try {
            const createResponse = await axios.post('http://localhost:5000/user', {
              email: user.email,
              displayName: user.displayName || 'User',
              firebaseUid: user.uid,
              phoneNumber: '',
              bloodType: '',
              totalDonations: 0,
              lastDonationDate: null
            });
            
            setFormData({
              displayName: createResponse.data.displayName,
              phoneNumber: createResponse.data.phoneNumber,
              bloodType: createResponse.data.bloodType,
              email: createResponse.data.email
            });
          } catch (createError) {
            console.error('Error creating user in MongoDB:', createError);
          }
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (user?.email) {
      ensureUserExists();
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
      console.log('Submitting form data:', formData); // Add this log
      
      const response = await axios.put(`http://localhost:5000/user/${user?.email}`, formData);
      
      console.log('Server response:', response); // Add this log
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been updated successfully.'
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error details:', error.response || error); // Add this log
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">User Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
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
        </form>
      ) : (
        <>
          <div className="flex items-center space-x-6 mb-6">
            <FaUserCircle className="w-24 h-24 text-gray-400" />
            <div>
              <h3 className="text-2xl font-semibold">{formData.displayName}</h3>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Personal Information</h4>
              <p><strong>Phone:</strong> {formData.phoneNumber || 'Not provided'}</p>
              <p><strong>Blood Type:</strong> {formData.bloodType || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Donation Statistics</h4>
              <p><strong>Total Donations:</strong> 5</p>
              <p><strong>Last Donation:</strong> 2023-05-15</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Profile;
