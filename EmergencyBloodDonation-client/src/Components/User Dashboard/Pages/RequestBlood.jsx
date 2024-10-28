import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

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
      console.log('Submitting request:', formData); // Debug log
      
      const response = await axios.post('http://localhost:5000/requestblood', formData);
      
      console.log('Response:', response); // Debug log

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Blood request submitted successfully'
        });
        // Reset form
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
      console.error('Error submitting request:', error); // Debug log
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong'
      });
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Request Blood</h2>
      <p className="mb-4">If you or someone you know needs blood, please fill out the form below with the required details.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type Needed</label>
          <select
            id="bloodType"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
          >
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

        <div>
          <label htmlFor="units" className="block text-sm font-medium text-gray-700">Units Required</label>
          <input
            type="number"
            id="units"
            name="units"
            value={formData.units}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
            required
          />
        </div>

        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestBlood;
