import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreateProfile from "./pages/CreateProfile"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/u/:username" element={<ProfilePage />} />

        {/* Protected Route */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App