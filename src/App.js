import React from "react";
import {BrowserRouter as  Router, Routes, Route} from 'react-router-dom';
import SignIn from './start/SignIn';
import SignUp from './start/SignUp';
import AppLayOut from './start/AppLayOut';
import Home from "./panel/pages/home/Home";
import Employee from "./panel/pages/admin/employee/Employee";
import Customer from "./panel/pages/customer/Customer";
import JobCard from "./panel/pages/jobcard/JobCard";
import ViewCard from "./panel/pages/jobcard/ViewCard";
import Diagnose from "./panel/pages/workshop/Diagnose";
import Repair from "./panel/pages/workshop/Repair";
import ViewWork from "./panel/pages/workshop/ViewWork";
import Login from "./customers/Login";
import Register from "./customers/Register";
import Profile from "./customers/pages/home/Profile";
import LayOut from "./customers/dashboard/LayOut";
import Homez from './customers/pages/home/Home'
import MyCards from "./customers/pages/home/MyCards";
import Sales from "./panel/pages/admin/sales/Sales";
import ItemTabs from "./customers/components/ItemTabs";
import StockManagement from "./panel/pages/admin/inventory/StockManagement";
import PointOfSale from "./panel/pages/pos/PointOfSale";
import OrderService from "./panel/pages/tech-admin/OrderService";
import Orders from "./panel/pages/workshop/Orders";
import PaymentTab from './panel/pages/admin/payment/PaymentTab';
import OrdersView from "./panel/pages/admin/orders/OrdersView";
import ReportTabs from "./customers/pages/reports/ReportTabs";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' exact element={<SignIn/>} />
          <Route path = '/signup' element={<SignUp/>} />
          <Route element={<AppLayOut/>}>
            <Route exact path='/home' element={<Home/>} />
            <Route exact path='customers' element={<Customer/>} />
            <Route exact path='/employees' element={<Employee/>} />
            <Route exact path='/stockmanagement' element={<StockManagement/>} />
            <Route exact path='/pointofsale' element={<PointOfSale/>} />
            <Route exact path='/jobcard' element={<JobCard/>} />
            <Route exact path="/viewcard" element={<ViewCard/>} />
            <Route exact path="/diagnosis" element={<Diagnose/>} />
            <Route exact path="/repair" element={<Repair/>} />
            <Route exact path="/mywork" element={<ViewWork/>} />
            <Route exact path="/sales" element={<Sales/>}/>
            <Route exact path="/viewpayments" element={<PaymentTab/>}/>
            <Route exact path="/orderservice" element={<OrderService/>} />
            <Route exact path="/assignment" element={<Orders/>}/>
            <Route exact path="/vieworders" element={<OrdersView/>} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
            <Route element={<LayOut/>}>
              <Route path="/menu" element={<Homez/>} />
              <Route path="/custprofile" element={<Profile/>} />
              <Route path="/mycards" element={<MyCards/>} />
              <Route path='/orders' element={<ItemTabs/>} />
              <Route path="/payreport" element={<ReportTabs/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
