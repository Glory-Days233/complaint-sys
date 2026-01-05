import './App.css';
import ComplaintForm from './Pages/ComplaintForm.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import AdminRegister from './Pages/AdminRegister.jsx';
import AdminDashboard from './Pages/AdminDashboard/index.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<ComplaintForm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-complaints" element={<AdminDashboard />} />
      </Routes>

  );
}

export default App;