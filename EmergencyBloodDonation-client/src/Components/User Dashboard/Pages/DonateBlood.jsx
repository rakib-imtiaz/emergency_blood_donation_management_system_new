import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserAlt, FaTint, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaNotesMedical, FaClipboardList } from 'react-icons/fa';

const DonateBlood = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    donorName: user?.displayName || '',
    donorEmail: user?.email || '',
    bloodType: 'A+',
    donationDate: '',
    donationTime: '',
    location: '',
    anyMedicalConditions: 'no',
    additionalNotes: '',
    status: 'pending'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/blood-donation', {
        ...formData,
        createdAt: new Date(),
      });

      if (response.data.insertedId) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Donation Scheduled Successfully',
          showConfirmButton: false,
          timer: 1500,
          background: '#1F2937',
          color: '#fff'
        });
        
        setFormData({
          donorName: user?.displayName || '',
          donorEmail: user?.email || '',
          bloodType: 'A+',
          donationDate: '',
          donationTime: '',
          location: '',
          anyMedicalConditions: 'no',
          additionalNotes: '',
          status: 'pending'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        background: '#1F2937',
        color: '#fff'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 shadow-2xl rounded-2xl"
    >
      <motion.h2 
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500"
      >
        Schedule Blood Donation
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FaUserAlt className="text-red-500" />
              Donor Name
            </label>
            <input
              type="text"
              name="donorName"
              value={formData.donorName}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FaTint className="text-red-500" />
              Blood Type
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FaCalendarAlt className="text-red-500" />
              Preferred Date
            </label>
            <input
              type="date"
              name="donationDate"
              value={formData.donationDate}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FaClock className="text-red-500" />
              Preferred Time
            </label>
            <input
              type="time"
              name="donationTime"
              value={formData.donationTime}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FaMapMarkerAlt className="text-red-500" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FaNotesMedical className="text-red-500" />
              Medical Conditions
            </label>
            <select
              name="anyMedicalConditions"
              value={formData.anyMedicalConditions}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <FaClipboardList className="text-red-500" />
            Additional Notes
          </label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            rows="3"
          ></textarea>
        </motion.div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-red-500 hover:to-red-600 transition-all duration-300"
        >
          Schedule Donation
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DonateBlood;
