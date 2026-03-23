import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import knowme_full_logo from "../assets/knowme_full_logo.png";

const Navbar = ({ onAuthRequired }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleCreateClick = () => {
    if (user) {
        navigate("/editor");
    } else {
        onAuthRequired(); // 🔥 open modal
    }
  };

  const handleLoginClick = () => {
    onAuthRequired(); // 🔥 open modal
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={knowme_full_logo}
            alt="KnowMe Logo"
            className="h-16 w-auto object-contain transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {/* RIGHT: USER + ACTIONS */}
        <div className="flex items-center gap-5">

          {user && (
            <span className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-medium text-gray-900">
                {user.username}
              </span>
            </span>
          )}

          {/* View Profile */}
          {user && (
            <button
              onClick={() => navigate(`/u/${user.username}`)}
              className="border border-gray-300 px-6 py-2 rounded-xl hover:bg-gray-100 transition text-sm"
            >
              View Profile
            </button>
          )}

          {/* Create Story (Primary CTA) */}
          <button
            onClick={handleCreateClick}
            className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
          >
            + Create Story
          </button>

          {/* Logout / Login */}
          {user ? (
            <button
              onClick={handleLogout}
              className="border border-gray-300 px-6 py-2 rounded-xl hover:bg-gray-100 transition text-sm"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="border border-gray-300 px-6 py-2 rounded-xl hover:bg-gray-100 transition text-sm"
            >
              Login
            </button>
          )}

        </div>
      </div>

      {/* ✨ Faded underline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-60"></div>

    </div>
  );
};

export default Navbar;