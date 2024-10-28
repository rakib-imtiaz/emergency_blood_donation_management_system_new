import { useContext } from "react";
import { AuthContext } from "./providers/AuthProvider";
import { Navigate } from "react-router-dom";
import { MutatingDots } from "react-loader-spinner";


const PrivateRoutes = ({children}) => {
    const { user, loading } = useContext(AuthContext)
    if(loading){
        return <div><MutatingDots visible={true} height="100" width="100"color="#4fa94d" secondaryColor="#4fa94d" radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        /></div>
       }
       if(user?.email){
        return  children;
       }
       return <Navigate to="/login"></Navigate>
};

export default PrivateRoutes;