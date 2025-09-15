import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MembershipProvider } from './context/MembershipContext';
import PrivateRoute from './context/PrivateRoute';
import { ToastContainer } from "react-toastify";
import './index.css';
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from './pages/Home/page';
import Login from './pages/Auth/Login/page';
import Signup from './pages/Auth/Register/page';
import About from './pages/About/page';
import Account from './pages/Account/page';
import PublicProfile from './pages/Account/PublicProfile/page';
import Events from './pages/Events/page';
import Support from './pages/Support/page';
import Terms from './pages/Terms/page';
import Privacy from './pages/Privacy/page';
import MySocieties from './pages/Account/MySocieties/page';
import Societies from './pages/Societies/page';
import SocietyDetail from './pages/Societies/Timeline/page';
import SocietyEvents from './pages/Societies/Events/page';
import SocietyMembers from './pages/Societies/Members/page';
import SocietyJoinRequests from './pages/Societies/JoinRequests/page';
import SocietySettings from './pages/Societies/Settings/page';
import NewSociety from './pages/Societies/Create/page';
import NewEvent from './pages/Events/NewEvent/page';
import EventDetailsPage from './pages/Events/Details/page';
import Sidebar from './shared/layout/Sidebar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MembershipProvider>
                  <div className="flex h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 relative">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>
                    <Sidebar />
                    <main className="flex-1 overflow-auto lg:ml-0 relative z-10">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/users/:id" element={<PublicProfile />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventDetailsPage />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/my-societies" element={<MySocieties />} />
                        <Route path="/societies" element={<Societies />} />
                        <Route path="/societies/new" element={<NewSociety />} />
                        <Route path="/societies/:id" element={<SocietyDetail />} />
                        <Route path="/societies/:id/events" element={<SocietyEvents />} />
                        <Route path="/societies/:id/events/new" element={<NewEvent />} />
                        <Route path="/societies/:id/members" element={<SocietyMembers />} />
                        <Route path="/societies/:id/join-requests" element={<SocietyJoinRequests />} />
                        <Route path="/societies/:id/settings" element={<SocietySettings />} />
                      </Routes>
                    </main>
                  </div>
                </MembershipProvider>
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
