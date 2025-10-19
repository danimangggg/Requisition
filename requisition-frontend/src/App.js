import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Use the new combined component
import EmployeeDashboardPage from './pages/EmployeeDashboardPage'; // Rename/create this
import CustomerDashboardPage from './pages/CustomerDashboardPage'; // New customer view// Rename/create this
import ImportPharm from './component/ImportPharmaceuticals'; 
import Requisition from './component/CustomerRequisition'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* The single login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboards based on role */}
        <Route path="/dashboard/employee" element={<EmployeeDashboardPage />} />
        <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
        <Route path="/" element={<ImportPharm />} />
        <Route path="/requisition" element={<Requisition />} />
        
        {/* Default route redirects to the new login page */}
        <Route path="*" element={<LoginPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;