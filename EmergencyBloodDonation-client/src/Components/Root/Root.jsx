
import { Outlet } from 'react-router-dom';
import Home from '../Home/Home';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';

const Root = () => {
    return (
        <div className='bg-gradient-to-r from-white via-red-100 to-red-50 ...'>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {/* <Footer></Footer> */}
        </div>
    );
};

export default Root;