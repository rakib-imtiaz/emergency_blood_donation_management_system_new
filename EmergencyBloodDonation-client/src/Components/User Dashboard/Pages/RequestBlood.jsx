import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserAlt, FaTint, FaMapMarkerAlt, FaPhoneAlt, FaHospital } from 'react-icons/fa';

const RequestBlood = () => {
  const [formData, setFormData] = useState({
    bloodType: 'A+',
    units: 1,
    patientName: '',
    location: '',
    contactNumber: '',
    urgency: 'normal'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/requestblood', formData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted',
          text: 'Your blood request has been successfully submitted',
          background: '#1F2937',
          color: '#fff',
          confirmButtonColor: '#DC2626'
        });
        setFormData({
          bloodType: 'A+',
          units: 1,
          patientName: '',
          location: '',
          contactNumber: '',
          urgency: 'normal'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.response?.data?.message || 'Something went wrong',
        background: '#1F2937',
        color: '#fff',
        confirmButtonColor: '#DC2626'
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Request Blood</h2>
          <p className="text-gray-600">Help us find the right donor by providing accurate information</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaUserAlt className="text-red-500" />
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaTint className="text-red-500" />
                  Blood Type
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaHospital className="text-red-500" />
                  Units Required
                </label>
                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>

              <motion.div 
                className="form-group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>

              <motion.div 
                className="form-group md:col-span-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaPhoneAlt className="text-red-500" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
            >
              Submit Blood Request
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RequestBlood;
