import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserInjured, FaTint, FaMapMarkerAlt, FaPhone, FaEnvelope, FaMars, FaVenusMars } from 'react-icons/fa';
import { RiHeartPulseFill, RiUserHeartFill } from 'react-icons/ri';
import Swal from 'sweetalert2';

const RequestBloodForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        },
        exit: { 
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const handleRequestBloodForm = (event) => {
        event.preventDefault();
        const form = event.target;
        //=================================
        // Patient information
        //=================================
        const name = form.patientname.value;
        const age = form.age.value;
        const gender = form.gender.value;
        const email = form.email.value;
        const contactNumber = form.contactNumber.value;

        //VALIDATION OF CONTACT NUMBER
        const regex = /^01\d{9}$/;
        if (!regex.test(contactNumber)) {
            return Swal.fire({
                icon: "error",
                text: "Invalid Contact number",
            });
        }

        const bloodGroup = form.bloodGroup.value;

        const presentAddress = form.presentAddress.value;
        const division = form.division.value;
        const district = form.district.value;
        //const presentCondition = form.presentCondition.value;

        //=================================
        //Extra information
        //=================================
        const bag = form.bag.value
        const relation = form.relation.value
        const reason = form.reason.value

        
        const RequestPatientInformation = { name,  gender, age, email, contactNumber, bloodGroup, presentAddress, division, district, bag, relation,reason }
        if (RequestPatientInformation) {
            console.log(RequestPatientInformation);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Requested Successfully",
                showConfirmButton: false,
                timer: 1500,

            });
        }


    }

    const renderProgressBar = () => (
        <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
                {['Patient Details', 'Location', 'Medical Info'].map((label, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex flex-col items-center ${idx + 1 === step ? 'text-red-500' : 'text-gray-400'}`}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                                ${idx + 1 === step ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        >
                            {idx + 1}
                        </motion.div>
                        <span className="text-sm font-medium">{label}</span>
                    </motion.div>
                ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
                <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step - 1) * 50}%` }}
                    className="h-full bg-red-500 rounded-full"
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto"
            >
                <div className="text-center mb-10">
                    <motion.h1 
                        className="text-4xl font-bold text-gray-800 mb-4"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        Blood Request Form
                    </motion.h1>
                    <motion.p
                        className="text-gray-600"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        Please provide accurate information to help us find the right donor
                    </motion.p>
                </div>

                {renderProgressBar()}

                <motion.div
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    variants={containerVariants}
                >
                    <div className="p-8">
                        <form onSubmit={handleRequestBloodForm} className="space-y-8">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        <div className="form-group space-y-2">
                                            <label className="flex items-center gap-2 text-gray-700 font-medium">
                                                <FaUserInjured className="text-red-500" />
                                                Patient Name
                                            </label>
                                            <input
                                                type="text"
                                                name="patientname"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                                placeholder="Enter patient name"
                                            />
                                        </div>
                                        {/* Add more step 1 fields with similar styling */}
                                    </motion.div>
                                )}

                                {/* Add similar sections for steps 2 and 3 */}
                            </AnimatePresence>

                            <div className="flex justify-between pt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setStep(Math.max(1, step - 1))}
                                    className={`px-6 py-3 rounded-lg ${step === 1 ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-500'}`}
                                    disabled={step === 1}
                                >
                                    Previous
                                </motion.button>
                                
                                {step < 3 ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setStep(Math.min(3, step + 1))}
                                        className="px-6 py-3 bg-red-500 text-white rounded-lg"
                                    >
                                        Next
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="px-6 py-3 bg-red-500 text-white rounded-lg"
                                    >
                                        Submit Request
                                    </motion.button>
                                )}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RequestBloodForm;
