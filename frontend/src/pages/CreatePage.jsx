import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/editor?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 px-6 py-16">

      <div className="max-w-5xl mx-auto text-center">

        {/* HEADER */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          What do you want to create?
        </h1>

        <p className="text-gray-600 mb-12 text-lg">
          Capture your story, send a message, or create something for the future.
        </p>

        {/* OPTIONS */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* STORY */}
          <div
            onClick={() => handleSelect("story")}
            className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition group"
          >
            <h2 className="text-xl font-semibold mb-3">
              📖 Your Story
            </h2>

            <p className="text-gray-600 text-sm">
              Turn your life into chapters like a biopic.
            </p>

            <p className="text-xs text-gray-400 mt-4">
              Childhood • Struggles • Growth • Future
            </p>

            <div className="mt-6 text-indigo-600 text-sm opacity-0 group-hover:opacity-100 transition">
              Start writing →
            </div>
          </div>

          {/* MESSAGE */}
          <div
            onClick={() => handleSelect("message")}
            className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl cursor-pointer transition group"
          >
            <h2 className="text-xl font-semibold mb-3">
              💌 A Message
            </h2>

            <p className="text-gray-600 text-sm">
              Say something meaningful to someone.
            </p>

            <p className="text-xs text-gray-400 mt-4">
              A letter • A note • A confession • A reminder
            </p>

            <div className="mt-6 text-indigo-600 text-sm opacity-0 group-hover:opacity-100 transition">
              Write message →
            </div>
          </div>

          {/* OPEN WHEN */}
          <div
            onClick={() => handleSelect("openwhen")}
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition group"
          >
            <span className="absolute top-3 right-3 text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                Recommended
            </span>

            <h2 className="text-xl font-semibold mb-3">
              ⏳ Open When…
            </h2>

            <p className="text-gray-600 text-sm">
              Create a message that unlocks at the perfect moment.
            </p>

            <div className="text-xs text-gray-400 mt-4 space-y-1">
              <p>“Open when you feel lost”</p>
              <p>“Open on your birthday”</p>
            </div>

            <div className="mt-6 text-indigo-600 text-sm opacity-0 group-hover:opacity-100 transition">
              Create moment →
            </div>
          </div>

        </div>

        {/* FEATURE GUIDE */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-6">
            What you can do with KnowMe
          </h3>

          <div className="grid md:grid-cols-3 gap-6 text-left">

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">🔐 Control Privacy</h4>
              <p className="text-sm text-gray-600">
                Keep it private, share with a link, or make it public.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">⏳ Schedule Moments</h4>
              <p className="text-sm text-gray-600">
                Deliver messages at the right time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2">🤖 AI Assistance</h4>
              <p className="text-sm text-gray-600">
                Turn simple thoughts into meaningful stories.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CreatePage;