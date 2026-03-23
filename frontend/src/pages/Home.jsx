import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SectionCard from "../components/SectionCard";
import AuthModal from "../components/AuthModal";
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

  const handleAuthSuccess = (loggedInUser) => {
    setShowAuth(false);
    if (loggedInUser?.username) {
      navigate(`/u/${loggedInUser.username}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100">

      {/* HERO */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          Say What Matters.
          <br />
          <span className="text-indigo-600">
            Now or When It Matters Most.
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Create stories, messages, jokes, or anything meaningful — and choose
          when they should be seen. Public, private, or unlocked at the perfect moment.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={handleCreateClick}
            className="bg-indigo-600 text-white px-7 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Start Creating
          </button>

          <button
            onClick={() => navigate("/demo")}
            className="border border-gray-300 px-7 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Watch Demo
          </button>
        </div>
      </div>

      {/* CORE BELIEF */}
      <div className="max-w-4xl mx-auto px-6 py-6 text-center">
        <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
          Some messages are meant for the right moment.
        </p>

        <p className="mt-4 text-lg text-gray-600">
          “This message is meant for the future.”
        </p>
      </div>

      {/* WHY */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <SectionCard>
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Why KnowMe Exists
          </h2>

          <p className="text-xl text-gray-700 text-center">
            Life isn’t just about moments — it’s about meaning.
          </p>

          <p className="mt-6 text-lg text-gray-600 text-center">
            KnowMe helps you capture your journey — your stories, lessons,
            thoughts, or even a simple message — and share them in a way
            that truly connects with others.
          </p>
        </SectionCard>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Create</h3>
            <p className="text-gray-600">
              Write anything — a story, message, joke, or memory. Use AI to improve, expand, or make it more emotional.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Choose</h3>
            <p className="text-gray-600">
              Make it public, private, or “Open When…” it matters most.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-indigo-600">Share</h3>
            <p className="text-gray-600">
              Get a QR code and share anywhere — even before it unlocks.
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
            A world where stories are felt, not just seen
          </p>

          <p className="mt-6 text-gray-700 leading-relaxed text-lg text-center">
            We believe the most powerful stories aren’t the loudest —
            they’re the most meaningful.
            <br /><br />
            KnowMe is building a space where people can share real experiences,
            leave something behind, and connect through moments that truly matter.
          </p>
        </SectionCard>
      </div>

      {/* FINAL CTA */}
      <div className="bg-indigo-600 text-white py-20 text-center">
        <h2 className="text-3xl font-semibold">
          Your story. Your message. Your moment.
        </h2>

        <p className="mt-4 text-indigo-100">
          Start now — or create something for the future.
        </p>

        <div className="mt-8">
          <button
            onClick={handleCreateClick}
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Start Creating
          </button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default Home;