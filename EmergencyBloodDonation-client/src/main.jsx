import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './Components/Root/Root';
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: '/donationinfo',
        element: <DonationInfo></DonationInfo>

      },
      {
        path: '/faq',
        element: <FAQ></FAQ>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/signup',
        element: <SignUp></SignUp>
      },
      {
        path: '/dashboard/*',
        element: <PrivateRoutes><DashboardContent /></PrivateRoutes>
      }
    ]
  },
  {
    path: "/donate",
    element: <PrivateRoutes><DonorForm></DonorForm></PrivateRoutes>
  },
  {
    path: "/requestbloodform",
    element: <PrivateRoutes><RequestBloodForm></RequestBloodForm></PrivateRoutes>
  },
  {
    path: '/userprofile',
    element: <PrivateRoutes><DashboardContent /></PrivateRoutes>
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
