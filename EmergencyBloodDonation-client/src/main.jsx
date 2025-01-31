import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App';
import ErrorPage from './Components/ErrorPage';
import Home from './Components/Home/Home';
import FAQ from './Components/Home/FAQ';
import Login from './Components/Registrations/Login';
import SignUp from "./Components/Registrations/SignUp";
import DonationInfo from './Components/Home/DonationInfo';
import AuthProvider from './providers/AuthProvider';
import DonorForm from './Components/DonorForm/DonorForm';
import PrivateRoutes from './PrivateRoutes';
import RequestBloodForm from './Components/Home/RequestBloodForm/RequestBloodForm';
import DashboardContent from './Components/User Dashboard/DashboardContent';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminDashboard from './Components/Admin/Pages/AdminDashboard';
import ManageDonors from './Components/Admin/Pages/ManageDonors';
import ManageRequests from './Components/Admin/Pages/ManageRequests';
import ManageUsers from './Components/Admin/Pages/ManageUsers';
import AdminRoute from './Components/Admin/AdminRoute';
import axios from 'axios';

// Set default base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "donationinfo",
        element: <DonationInfo />
      },
      {
        path: "faq",
        element: <FAQ />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "signup",
        element: <SignUp />
      },
      {
        path: "donate",
        element: <PrivateRoutes><DonorForm /></PrivateRoutes>
      },
      {
        path: "requestbloodform",
        element: <PrivateRoutes><RequestBloodForm /></PrivateRoutes>
      },
      {
        path: "userprofile",
        element: <PrivateRoutes><DashboardContent /></PrivateRoutes>
      }
    ]
  },
  {
    path: "admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      {
        path: "",
        element: <AdminDashboard />
      },
      {
        path: "donors",
        element: <ManageDonors />
      },
      {
        path: "requests",
        element: <ManageRequests />
      },
      {
        path: "users",
        element: <ManageUsers />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
