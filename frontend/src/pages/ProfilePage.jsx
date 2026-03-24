import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/stories/user/${user.id}`
        );
        const data = await res.json();
        setStories(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchStories();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 text-gray-900 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* 🔥 Profile Hero */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-semibold">
              {user?.username}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Your life is a story worth telling
            </p>
          </div>
        </div>

        {/* ✨ Create Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-10">
          <h2 className="text-lg font-semibold mb-2">
            ✨ Share something today
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            A moment, a lesson, or your story.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/editor?type=story")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              📖 Story
            </button>

            <button
              onClick={() => navigate("/editor?type=moment")}
              className="px-4 py-2 border rounded-md"
            >
              ✨ Moment
            </button>

            <button
              onClick={() => navigate("/editor?type=lesson")}
              className="px-4 py-2 border rounded-md"
            >
              💡 Lesson
            </button>

            <button
              onClick={() => navigate("/editor?type=message")}
              className="px-4 py-2 border rounded-md"
            >
              🎁 Open When
            </button>
          </div>
        </div>

        {/* 📚 Stories Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Your Stories
          </h2>

          {stories.length === 0 ? (
            <div className="text-center bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-500">
                Nothing here yet 😔
              </p>

              <button
                onClick={() => navigate("/editor")}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Create your first story
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() =>
                    navigate(`/u/${story.username}/${story.slug}`)
                  }
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
                >
                  <h3 className="font-medium text-gray-900">
                    {story.title || "Untitled"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {story.content?.slice(0, 80)}...
                  </p>

                  {/* 🔥 Type badge */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {story.type || "story"}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(story.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;