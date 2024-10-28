import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../providers/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';

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
          timer: 1500
        });
        
        // Reset form
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
        text: 'Something went wrong!'
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
    <div className="p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Schedule Blood Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Donor Name</label>
          <input
            type="text"
            name="donorName"
            value={formData.donorName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
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

        <div>
          <label className="block text-sm font-medium mb-1">Preferred Date</label>
          <input
            type="date"
            name="donationDate"
            value={formData.donationDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preferred Time</label>
          <input
            type="time"
            name="donationTime"
            value={formData.donationTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Any Medical Conditions?</label>
          <select
            name="anyMedicalConditions"
            value={formData.anyMedicalConditions}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Schedule Donation
        </button>
      </form>
    </div>
  );
};

export default DonateBlood;
