import Swal from "sweetalert2";
import Navbar from "../Home/Navbar";


const DonorForm = () => {
    const handleDonorInfoForm = (event) => {
        event.preventDefault();
        const form = event.target;
        //=================================
        // personal information
        //=================================
        const name = form.donorname.value;
        const patientName = form.patientName.value
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
        const occupation = form.occupation.value;
        const presentAddress = form.presentAddress.value;
        const division = form.division.value;
        const district = form.district.value;
        //const presentCondition = form.presentCondition.value;

        //=================================
        //Extra information
        //=================================
        const guardian = form.guardian.value
        const relation = form.relation.value

        //VALIDATION OF CONTACT NUMBER
        const guardianContact = form.guardianContact.value
        if (!regex.test(guardianContact)) {
            return Swal.fire({
                icon: "error",
                text: "Invalid Contact number",
            });
        }
        const donorInformation = { name, patientName, gender, age, email, contactNumber, bloodGroup, occupation, presentAddress,division,district, guardian, relation, guardianContact }
        if (donorInformation) {
            console.log(donorInformation);
            Swal.fire({
                
                icon: "success",
                title: "Donation Form Submitted Successfully",
                showConfirmButton: false,
                timer: 1500,

            });
        }


    }
    return (
        <div>
            <Navbar></Navbar>
            <div className="hero">

            <div className="hero-content flex-col">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold p-5">Donor Form</h1>

                </div>
                <div className="p-10 border border-red-300 rounded-lg bg-gradient-to-r from-red-50 via-red-100 to-red-50">
                    <form onSubmit={handleDonorInfoForm} className="card-body">
                        <div className="lg:flex gap-10">
                            {/* Personal Information */}
                            <div className="lg:w-1/2">
                                <h1 className="text-3xl">Personal Information</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Donor Name</span>
                                        </label>
                                        <input type="text" name="donorname" placeholder="Donor" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Patient Name</span>
                                        </label>
                                        <input type="text" name="patientName" placeholder="patient name" className="input input-bordered" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Age</span>
                                        </label>
                                        <input type="text" name="age" placeholder="Age" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Email</span>
                                        </label>
                                        <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Contact Number</span>
                                        </label>
                                        <input type="text" name="contactNumber" placeholder="Contact" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Division</span>
                                        </label>
                                        <select name="division" className="select select-bordered w-full max-w-xs">
                                            <option>Barishal</option>
                                            <option>Chattogram</option>
                                            <option>Dhaka</option>
                                            <option>Khulna</option>
                                            <option>Mymensingh</option>
                                            <option>Rajshahi</option>
                                            <option>Rangpur</option>
                                            <option>Sylhet</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">District</span>
                                        </label>
                                        <select name="district" className="select select-bordered w-full max-w-xs">
                                            <option>Bandarban</option>
                                            <option>Barguna</option>
                                            <option>Brahmanbaria</option>
                                            <option>Chandpur</option>
                                            <option>Chattogram</option>
                                            <option>Chuadanga</option>
                                            <option>Cumilla</option>
                                            <option>Dhaka</option>
                                            <option>Dinajpur</option>
                                            <option>Faridpur</option>
                                            <option>Feni</option>
                                            <option>Gaibandha</option>
                                            <option>Gopalganj</option>
                                            <option>Habiganj</option>
                                            <option>Jamalmati</option>
                                            <option>Jashore</option>
                                            <option>Jhalokati</option>
                                            <option>Jhenaidah</option>
                                            <option>Joypurhat</option>
                                            <option>Khagrachari</option>
                                            <option>Khulna</option>
                                            <option>Kishoreganj</option>
                                            <option>Kurigram</option>
                                            <option>Kushtia</option>
                                            <option>Lakshmipur</option>
                                            <option>Lalmonirhat</option>
                                            <option>Madaripur</option>
                                            <option>Magura</option>
                                            <option>Manikganj</option>
                                            <option>Meherpur</option>
                                            <option>Moulvibazar</option>
                                            <option>Munshiganj</option>
                                            <option>Narayanganj</option>
                                            <option>Narsingdi</option>
                                            <option>Natore</option>
                                            <option>Nawabganj</option>
                                            <option>Netrakona</option>
                                            <option>Nilphamari</option>
                                            <option>Noakhali</option>
                                            <option>Pabna</option>
                                            <option>Panchagarh</option>
                                            <option>Patuakhali</option>
                                            <option>Pirganj</option>
                                            <option>Rajbari</option>
                                            <option>Rajshahi</option>
                                            <option>Rangamati</option>
                                            <option>Rangpur</option>
                                            <option>Satkhira</option>
                                            <option>Shariatpur</option>
                                            <option>Sherpur</option>
                                            <option>Sirajganj</option>
                                            <option>Sunamganj</option>
                                            <option>Sylhet</option>
                                            <option>Tangail</option>
                                        </select>

                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Blood Group</span>
                                        </label>
                                        <select name="bloodGroup" className="select select-bordered w-full max-w-xs">
                                            <option>A+</option>
                                            <option>B+</option>
                                            <option>AB+</option>
                                            <option>O+</option>
                                            <option>A-</option>
                                            <option>B-</option>
                                            <option>AB-</option>
                                            <option>O-</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Occupation</span>
                                        </label>
                                        <input type="text" name="occupation" placeholder="Occupation" className="input input-bordered" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Present Address</span>
                                        </label>
                                        <input type="text" name="presentAddress" placeholder="Present Address" className="input input-bordered" required />
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Gender</span>
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="cursor-pointer label">
                                            <input type="radio" name="gender" value="Male" className="radio radio-bordered" />
                                            <span className="label-text">Male</span>
                                        </label>
                                        <label className="cursor-pointer label">
                                            <input type="radio" name="gender" value="Female" className="radio radio-bordered" />
                                            <span className="label-text">Female</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Vertical Line */}
                            <div className="lg:w-1 bg-gray-300"></div>

                            {/* Extra Information */}
                            <div className="lg:w-1/2">
                                <h1 className="text-3xl">Extra Information</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Guardian</span>
                                        </label>
                                        <input type="text" name="guardian" placeholder="guardian" className="input input-bordered" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Relation</span>
                                        </label>
                                        <input type="text" name="relation" placeholder="relation with guardian" className="input input-bordered" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Guardian Contact</span>
                                        </label>
                                        <input type="text" name="guardianContact" placeholder="guardianContact" required className="input input-bordered" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn bg-red-500 hover:bg-red-400 text-white">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>

        
    );
};

export default DonorForm;