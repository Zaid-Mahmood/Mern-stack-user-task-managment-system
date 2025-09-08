import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css'
import { useState } from 'react';
import Login from './auth/login/Login';
import Signup from './auth/signup/Signup';
import NotFound from './auth/NotFound/NotFound';
import ProtectedComponents from './ProtectedComponents/ProtectedComponents';
import MainDashboard from './ProtectedComponents/MainDashboard/MainDashboard';
import ForgotPassword from './auth/forgotPassword/ForgotPassword';
import ResetPassword from './auth/resetPassword/ResetPassword';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route element={<ProtectedComponents isLoggedIn={isLoggedIn} />}>
          <Route path='/dashboard' element={<MainDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
