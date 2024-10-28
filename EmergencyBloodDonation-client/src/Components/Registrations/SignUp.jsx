import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";


const SignUp = () => {
    const {createUser} = useContext(AuthContext)
    const [signUpError,setSignUpError]= useState('')
   
    const handleSignUp =event =>{
        event.preventDefault()
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;
       
        //VALIDATION OF CONTACT NUMBER
        const regex = /^01\d{9}$/;
        if (!regex.test(phone)) {
            return Swal.fire({
                icon: "error",
                text: "Invalid Contact number",
            });
        }
        
        const password = form.password.value;
        const user = {name,phone,email,password}
        console.log(user);
        setSignUpError("")
        //reset validation
        
        createUser(email,password)
        .then(result=>{
            const user= result.user;
            console.log(user);
            Swal.fire("Registered Successfully");

        })
        .catch(error=>{
            console.error(error);
            setSignUpError(error.message)
        })

    }
    return (
        <div className="hero mt-5 bg-gradient-to-r from-white via-red-100 to-red-50 ...">
        <div className="hero-content  flex-col">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold mb-8 text-red-500">Register now!</h1> 
            </div>
            <div className="card  border border-red-300 p-8">
                <form onSubmit={handleSignUp} className="card-body mx-auto">
                <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" name='name' placeholder="username" className="input input-bordered md:w-96" required />
                    </div>
                    
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Phone</span>
                        </label>
                        <input type="text" name='phone' placeholder="phone number" className="input input-bordered md:w-96" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" name='email' placeholder="email" className="input input-bordered md:w-96" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" name='password' placeholder="password" className="input input-bordered md:w-96" required />
                        
                    </div>
                    {
                        // Viewing authentication error in SignUp
                        signUpError && <p className="text-red-500 text-lg font-medium w-2/3">{signUpError}</p>
                    }
                    <div className="form-control mt-6">
                        <button className="btn bg-red-500 hover:bg-red-400 text-white">Sign Up</button>
                    </div>
                    <p>Already have an Account? Please <Link className="text-blue-500" to='/login'>Login</Link></p>
                </form>
            </div>
        </div>
    </div>
    );
};

export default SignUp;