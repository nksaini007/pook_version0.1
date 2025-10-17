import React, { useContext } from 'react'
import AdminDashboard from './AdminDashboard'
import ConsumerDashboard from './ConsumerDashboard'
import DeliveryDashboard from './DeliveryDashboard'
import SellerDashboard from './SellerDashboard'
import { AuthContext } from '../../context/AuthContext'
const Dashboardloader = () => {
    const {user }=useContext(AuthContext);
 switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "seller":
    case "teacher":
      return <SellerDashboard />;
    case "delivery":
      return <DeliveryDashboard />;
    default:
      return <ConsumerDashboard />;
  }
  
}

export default Dashboardloader
