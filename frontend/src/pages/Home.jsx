import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import SectionCard from "../components/SectionCard"
import AuthModal from "../components/AuthModal";
import knowme_full_logo from "../assets/knowme_full_logo.png";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleCreateClick = () => {
    if (user) {
      navigate("/create");
    } else {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    navigate("/create"); // redirect after login/signup
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900">

      {/* NAVBAR */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src={knowme_full_logo} 
            alt="KnowMe Logo" 
            className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        <button
          onClick={handleCreateClick}
          className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Create Story
        </button>
      </div>

      {/* HERO */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          Your Life Is Your Story.
          <br />
          <span className="text-indigo-600">
            Your Story Deserves To Be Known.
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          KnowMe helps you share your life journey with the world.
          Create your personal story and let anyone discover it with a simple scan.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={handleCreateClick}
            className="bg-indigo-600 text-white px-7 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Create Your Story
          </button>

          <button className="border border-gray-300 px-7 py-3 rounded-xl hover:bg-gray-100 transition">
            View Demo
          </button>
        </div>

      </div>

      {/* OUR MOTIVE */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <SectionCard>
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Our Motive
          </h2>

          <p className="text-xl text-gray-700 text-center">
            Everyone is a hero in their own life.
          </p>

          <p className="mt-6 text-lg text-gray-600 text-center">
            <span className="text-indigo-600 font-medium">
              KnowMe turns your journey into a story
            </span>{" "}
            that can be shared anywhere — on a T-shirt, sticker, laptop,
            or even a tattoo.
          </p>
        </SectionCard>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Create</h3>
            <p className="text-gray-600">
              Build your personal story in minutes using simple prompts
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Generate</h3>
            <p className="text-gray-600">
              Get your unique shareable code instantly
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Share</h3>
            <p className="text-gray-600">
              Let the world discover your journey anywhere, anytime
            </p>
          </div>
        </div>
      </div>

      {/* VISION */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <SectionCard>
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Our Vision
          </h2>
          <p className="text-xl text-gray-700 font-semibold text-center">
            A world connected through stories
          </p>

          <p className="mt-6 text-gray-700 leading-relaxed text-lg text-center">
            KnowMe aims to build a global community where people connect
            through authentic human stories rather than superficial content.
            <br /><br />
            By sharing experiences, people can inspire others, create empathy,
            and remind the world that every life journey matters.
          </p>
        </SectionCard>
      </div>

      {/* FINAL CTA */}
      <div className="bg-indigo-600 text-white py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Your story matters.
        </h2>

        <p className="mt-4 text-indigo-100">
          Share it with the world.
        </p>

        <div className="mt-8">
          <button
            onClick={handleCreateClick}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Start Your Story
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © 2026 KnowMe. All rights reserved.
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  )
}

export default Home