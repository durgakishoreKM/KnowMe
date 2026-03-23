import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";

const Layout = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100">

      <Navbar onAuthRequired={() => setShowAuth(true)} />

      <div className="pt-4">
        <Outlet />   {/* 🔥 THIS IS THE FIX */}
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

    </div>
  );
};

export default Layout;