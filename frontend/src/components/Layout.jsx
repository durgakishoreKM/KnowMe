import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";

const Layout = ({ children }) => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100">

      <Navbar onAuthRequired={() => setShowAuth(true)} />

      <div className="pt-4">
        {children}
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

    </div>
  );
};

export default Layout;