// src/routes/ProtectedRoute.jsx
import { Navigate, redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Children, useEffect,useState } from "react";
import Loader from "../components/common/Loader";




const redirectMap ={
  // -----------superadmin----------
  SUPERADMIN: 'superadmin/dashboard',

  // ------------company admins -------
  COMPANY_ADMIN:   '/admin/dashboard',
  HR_MANAGER:      '/hr/dashboard',
  FINANCE_MANAGER: '/finance/dashboard',
  AUDITOR:         '/auditor/dashboard',

  // ---------Branch level-------
  MANAGER:   '/manager/dashboard',
  STAFF:     '/staff/dashboard',
  CASHIER:   '/cashier/dashboard',
  SALESMAN:  '/salesman/dashboard',

};

const ProtectedRoute = ({allowedRoles, children}) =>{
  const {isLoggedIn, role, loading } = useAuth();

  const [redirectPath,setRedirectPath]= useState(null);

  useEffect(()=>{
    if (loading) return;

    if (!isLoggedIn){
      setRedirectPath('/login');
    }
    else if (role && !allowedRoles.includes(role)){
      setRedirectPath(redirectMap[role] || '/login');
    }
    else{
      setRedirectPath(null);
    }

  },[isLoggedIn, role, loading, allowedRoles]);

  if (loading){
    return <Loader message="Checking Authentication..."/>;
  }
  if (redirectPath){
    return <Navigate to={redirectPath} replace/>;
  }
  return children;
};

export default ProtectedRoute;



