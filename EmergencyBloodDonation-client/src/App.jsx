import { Outlet } from 'react-router-dom';
import Navbar from './Components/Home/Navbar';
import Footer from './Components/Home/Footer';

function App() {
  return (
    <div className="bg-gradient-to-r from-white via-red-100 to-red-50">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
