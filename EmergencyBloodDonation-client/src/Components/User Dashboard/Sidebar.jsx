import React, { useContext } from 'react';
import { FaUserCircle, FaHistory, FaTint, FaChartLine, FaComments } from 'react-icons/fa';
import { RiUserHeartLine } from 'react-icons/ri';
import { AuthContext } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Sidebar = ({ setActivePage, activePage, isSidebarOpen, setIsSidebarOpen }) => {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut()
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: FaUserCircle },
    { id: 'history', label: 'Donation History', icon: FaHistory },
    { id: 'request', label: 'Request Blood', icon: FaTint },
    { id: 'donate', label: 'Donate Blood', icon: RiUserHeartLine },
    { id: 'tracker', label: 'Blood Tracker', icon: FaChartLine },
    { id: 'chat', label: 'Chat', icon: FaComments },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-red-600 text-white z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <FaUserCircle className="w-10 h-10 text-white" />
              <span className="font-semibold">User</span>
            </div>
            <button 
              className="md:hidden text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center w-full text-left py-2 px-4 rounded transition-colors duration-200 ${
                  activePage === item.id ? 'bg-red-700' : 'hover:bg-red-500'
                }`}
              >
                <item.icon className="mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <button
          onClick={handleLogout}
          className="absolute bottom-0 w-full py-4 text-white hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
