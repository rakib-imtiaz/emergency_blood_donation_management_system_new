import { Link } from "react-router-dom";
import banner from "../../assets/DonateBloodBanner.jpg";

const Banner = () => {
    return (


        <div className="hero min-h-screen">
           <img className="w-screen h-screen" src={banner} alt="" />
                
            <div className="hero-overlay bg-opacity-30"></div>
            
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-2xl">
                    <h1 className="mb-10 lg:text-5xl text-3xl font-bold text-white"> Your blood donation today could save someone's life tomorrow.</h1>
                    <p className="mb-10 text-xl text-white">
                    Donating blood can improve your cardiovascular health and reduce the
                    risk of heart disease.
                    </p>
                   <div className="grid sm:grid-cols-2 gap-5">
                   <Link to='/donate' className="lg:px-8 py-3 lg:text-lg text-red-600 font-semibold rounded-lg hover:bg-red-700 border-2 hover:text-white bg-[#fff8f0]">Donate Now</Link>
                   <Link to='/requestbloodform' className="border-2 py-3 lg:px-8 hover:bg-white hover:text-red-700 lg:text-lg font-semibold rounded-lg ">Request Blood</Link>
                   </div>
                </div>
            </div>
        </div>



        // <div className="relative">
        //     <div className="">
        //         <div className="relative">
        //             <img className="md:w-[80%]  mx-auto" src={banner} alt="Donation Banner" />
        //             <div className="absolute md:w-[80%] mx-auto inset-0 bg-black bg-opacity-20"></div>
        //         </div>
        //         <div className="absolute inset-y-0  flex items-center md:w-[60%] p-8 ">
        //             <div className="md:text-right text-white">
        //                 <p className="md:text-2xl lg:text-4xl font-bold">
        //                     "Your blood donation today could save someone's life tomorrow."
        //                 </p>
        //                 <br />
        //                 <p className="hidden md:block md:text-lg lg:text-2xl ml-4  ">
        //                     Donating blood can improve your cardiovascular health and reduce the
        //                     risk of heart disease.
        //                 </p>
        //                 <div className="flex lg:justify-end lg:items-center lg:mt-10 lg:my-4">
        //                     <div className="mr-5">
        //                         <Link to='/donate' className="lg:px-8 py-3 lg:text-lg text-red-600 font-semibold rounded-lg hover:bg-red-700 border-2 hover:text-white bg-[#fff8f0]">Donate Now</Link>
        //                     </div>
        //                     <div className="">
        //                         <Link to='/requestbloodform' className="border-2 py-3 lg:px-8 hover:bg-white hover:text-red-700 lg:text-lg font-semibold rounded-lg ">Request Blood</Link>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};

export default Banner;