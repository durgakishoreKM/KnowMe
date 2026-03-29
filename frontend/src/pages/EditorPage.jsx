import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import slugify from "slugify";

const storyChapters = [
  {
    title: "The Beginning",
    subtitle: "Where did it all start?",
    prompt: "Tell us about your childhood, family, and early memories 👶",
  },
  {
    title: "The Turning Point",
    subtitle: "Moments that shaped you",
    prompt: "What challenges or decisions changed your path?",
  },
  {
    title: "The Journey",
    subtitle: "Your growth and hustle",
    prompt: "Tell us about your career, struggles, and achievements",
  },
  {
    title: "Who You Are Today",
    subtitle: "Your present self",
    prompt: "What defines you today?",
  },
  {
    title: "The Future",
    subtitle: "Your vision ahead",
    prompt: "Where do you see yourself going?",
  },
];

const EditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "story";

  const [mode, setMode] = useState(type);
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(
    Array(storyChapters.length).fill("")
  );

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const [visibility, setVisibility] = useState("public");

  // 🧠 Helpers
  const isStory = mode === "story";

  let finalSlug = slug;

  // generate slug ONLY if it doesn't exist
  if (!finalSlug) {
    finalSlug =
      slugify(title, { lower: true, strict: true }) +
      "-" +
      Date.now();
  }

  const handleChange = (e) => {
    const updated = [...answers];
    updated[step] = e.target.value;
    setAnswers(updated);
  };

  const handleSingleChange = (e) => {
    setAnswers([e.target.value]);
  };

  const nextStep = () => {
    if (step < storyChapters.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const generateFullStory = () => {
    return storyChapters
      .map((chapter, index) => {
        return `\n\n${chapter.title}\n${answers[index]}`;
      })
      .join("");
  };

  // SAVE
  const handleSave = async () => {
    try {
      setSaving(true);

      let content = "";

      if (mode === "story") {
        content = generateFullStory();
      } else {
        content = answers[0]; // message / openwhen uses single input
      }

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User not logged in.");
        setSaving(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/stories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // REQUIRED
          },
          body: JSON.stringify({
            title: title || "My Life Story",
            content: content,
            visibility: visibility || "public", // NEW
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("CREATE FAILED:", errorData);
        setSaving(false);
        return;
      }

      const data = await response.json();
      if (!data?.slug) {
        console.error("Slug missing:", data);
        setSaving(false);
        return;
      }
      setSlug(data.slug);
      setSaving(false);
      navigate(`/u/${user.username}/${data.slug}`);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  // 🤖 AI
  const handleAI = async (type) => {
    try {
      const currentText = isStory ? answers[step] : answers[0];
      if (!currentText) return;

      setAiLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/enhance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: currentText,
            type,
          }),
        }
      );

      const data = await res.json();

      const updated = [...answers];
      if (isStory) {
        updated[step] = data.result;
      } else {
        updated[0] = data.result;
      }

      setAnswers(updated);
      setAiLoading(false);
    } catch (err) {
      console.error(err);
      setAiLoading(false);
    }
  };

  // 🎬 PREVIEW MODE
  if (previewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-100 text-gray-800 px-6 py-12">

        <div className="max-w-3xl mx-auto">

          {/* ✨ Preview Hint */}
          <p className="text-center text-sm text-gray-500 mb-6">
            This is how your story will appear ✨
          </p>

          {/* 🌸 Decorative Top */}
          <div className="text-center mb-6 text-pink-400 text-sm">
            ✿ ✿ ✿
          </div>

          {/* 📖 Story Card */}
          <div className="bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-lg">

            {/* 🎬 TITLE */}
            <h1 className="text-4xl font-bold text-center mb-12 leading-tight">
              {title || (isStory ? "My Life Story" : "My Message")}
            </h1>

            {/* 📜 CONTENT */}
            {isStory ? (
              <div className="space-y-12">
                {storyChapters.map((chapter, index) => (
                  <div key={index}>
                    <p className="text-sm text-gray-400 uppercase mb-2">
                      Chapter {index + 1}
                    </p>

                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                      {chapter.title}
                    </h2>

                    <div className="h-px bg-gray-200 mb-6"></div>

                    <p className="text-gray-700 leading-8 whitespace-pre-line">
                      {answers[index] || "This part is yet to be written..."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-line text-lg leading-8">
                {answers[0] || "Your message will appear here..."}
              </p>
            )}

          </div>

          {/* 🎮 ACTIONS */}
          <div className="flex justify-between mt-10 items-center">

            <button
              onClick={() => setPreviewMode(false)}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              ← Back to Editing
            </button>

            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="border p-2 rounded-lg mt-4"
            >
              <option value="public">🌍 Public</option>
              <option value="followers">🔒 Followers Only</option>
              <option value="private">📝 Only Me</option>
            </select>

            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-md"
            >
              Save Story
            </button>

          </div>

        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 flex items-center justify-center px-6">

        <div className="max-w-4xl w-full text-center">

          <h1 className="text-4xl font-bold mb-4">
            What do you want to create?
          </h1>

          <p className="text-gray-600 mb-10">
            Capture your story, send a message, or create something for the future.
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            {/* STORY */}
            <div
              onClick={() => setMode("story")}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg cursor-pointer transition"
            >
              <h2 className="text-xl font-semibold mb-2">📖 Your Story</h2>
              <p className="text-gray-600 text-sm">
                Write your life journey in chapters like a biopic
              </p>
            </div>

            {/* MESSAGE */}
            <div
              onClick={() => setMode("message")}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg cursor-pointer transition"
            >
              <h2 className="text-xl font-semibold mb-2">💌 A Message</h2>
              <p className="text-gray-600 text-sm">
                Write something meaningful for someone
              </p>
            </div>

            {/* OPEN WHEN */}
            <div
              onClick={() => setMode("openwhen")}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg cursor-pointer transition border-2 border-indigo-200"
            >
              <h2 className="text-xl font-semibold mb-2">⏳ Open When…</h2>
              <p className="text-gray-600 text-sm">
                Create a message that unlocks at the perfect moment
              </p>
            </div>

          </div>

        </div>
      </div>
    );
  }
  // 📝 EDIT MODE
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-500">
            ← Back
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* MODE SELECTOR */}
        <div className="flex gap-3 mb-6 justify-center">
          {["story", "message", "openwhen"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setStep(0);
                setAnswers(Array(storyChapters.length).fill(""));
              }}
              className={`px-4 py-2 rounded-full text-sm border ${
                mode === m
                  ? "bg-indigo-600 text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {m === "story" && "📖 Story"}
              {m === "message" && "💌 Message"}
              {m === "openwhen" && "⏳ Open When…"}
            </button>
          ))}
        </div>

        {/* TITLE */}
        <input
          type="text"
          placeholder={
            mode === "story"
              ? "Your Story Title"
              : mode === "message"
              ? "Message Title"
              : "Open when..."
          }
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-semibold outline-none mb-6"
        />

        {/* STORY MODE */}
        {isStory && (
          <>
            <p className="text-sm text-gray-500 mb-2">
              Chapter {step + 1} of {storyChapters.length}
            </p>

            <h2 className="text-2xl font-bold">
              {storyChapters[step].title}
            </h2>

            <p className="text-gray-500 mb-4">
              {storyChapters[step].subtitle}
            </p>

            <p className="mb-3 font-medium">
              {storyChapters[step].prompt}
            </p>

            <textarea
              value={answers[step]}
              onChange={handleChange}
              rows={6}
              className="w-full border rounded-xl p-4"
            />
          </>
        )}

        {/* MESSAGE / OPENWHEN */}
        {!isStory && (
          <>
            <textarea
              value={answers[0]}
              onChange={handleSingleChange}
              rows={8}
              placeholder="Write your message..."
              className="w-full border rounded-xl p-4"
            />
          </>
        )}

        {/* AI */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {["improve", "emotional", "expand"].map((t) => (
            <button
              key={t}
              onClick={() => handleAI(t)}
              disabled={aiLoading}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              {t === "improve" && "✨ Improve"}
              {t === "emotional" && "🪄 Emotional"}
              {t === "expand" && "⚡ Expand"}
            </button>
          ))}

          {aiLoading && <span>Thinking...</span>}
        </div>

        {/* NAV */}
        {isStory && (
          <div className="flex justify-between mt-6">
            <button onClick={prevStep} disabled={step === 0}>
              Back
            </button>

            {step === storyChapters.length - 1 ? (
              <button onClick={() => setPreviewMode(true)}>
                Preview
              </button>
            ) : (
              <button onClick={nextStep}>Next</button>
            )}
          </div>
        )}

        {!isStory && (
          <div className="mt-6 text-right">
            <button onClick={() => setPreviewMode(true)}>
              Preview
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default EditorPage;