import { Link, NavLink } from "react-router-dom";
import logoheader from "../../assets/logoheader.png"
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import MarqueeHeading from "./MarqueeHeading/MarqueeHeading";
import Marquee from "react-fast-marquee";
const Navbar = () => {
    const { user, logOut } = useContext(AuthContext)
    const handleSignOut = () => {
        logOut()
            .then()
            .catch()
    }


    const navlink = <>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg  rounded border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4 border-red-400 text-lg font-medium  rounded"
        } to='/'>Home</NavLink></li>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg   border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4  border-red-400 text-lg font-medium  "
        } to='/DonationInfo'>Donation Info</NavLink></li>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg   border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4 border-red-400 text-lg font-medium  "
        } to='/faq'>FAQ</NavLink></li>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg   border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4 border-red-400 text-lg font-medium  "
        } to='/signup'>Sign Up</NavLink></li>
        <li>
            {
                user ? <button onClick={handleSignOut} className=" text-red-600 hover:text-red-700  font-medium text-lg   border-b-4 border-red-600">SignOut</button> : <Link to='/login'><button className="text-red-600 hover:border-b-4 border-red-400 text-lg font-medium ">Login</button></Link>
            }
        </li>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg  rounded border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4 border-red-400 text-lg font-medium  rounded"
        } to='/donate'>Donate now</NavLink>
        </li>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg  rounded border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4 border-red-400 text-lg font-medium  rounded"
        } to='/requestbloodform'>Request Blood</NavLink>
        </li>
        <li><NavLink className={({ isActive }) =>
            isActive
                ? "text-red-600 hover:text-red-700  font-medium text-lg  rounded border-b-4 border-red-600"
                : "text-red-600 hover:border-b-4 border-red-400 text-lg font-medium  rounded"
        } to='/userprofile'>user profile</NavLink>
        </li>
    </>
    return (
       <div>
        <Marquee><MarqueeHeading></MarqueeHeading></Marquee>
         <div className="navbar bg-gradient-to-r from-white via-red-100 to-red-50 ... max-w-screen-2xl mx-auto">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        {navlink}
                    </ul>
                </div>
                <img className="md:w-48 sm:w-10" src={logoheader} alt="" />
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navlink}
                </ul>
            </div>
            <div className="navbar-end">
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
            </div>
        </div>
       </div>
    );
};

export default Navbar;