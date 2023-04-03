import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Registration from './pages/Registration.jsx';
import Profile from './pages/Profile.jsx';
import videoBg from './assets/images/videoBg.mp4';
import './custom.css';
import { ToastContainer } from 'react-toastify';

function App() {

    return (
        <Router>
                <ToastContainer />
                <video className="video-1" src={videoBg} autoPlay loop muted />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/Profile" element={<Profile />} />
            </Routes>
        </Router>
    );
}


export default App;
