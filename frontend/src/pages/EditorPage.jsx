import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import slugify from "slugify";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

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

// Emotional headings for Open When
const emotionalHeadings = [
  "A Message Just For You",
  "Your Future Self Will Thank You",
  "A Special Note, Waiting in Time",
  "A Secret for Your Heart",
  "A Little Surprise Awaits You",
];

const EditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "story";

  const [mode, setMode] = useState(type);
  const [title, setTitle] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(storyChapters.length).fill(""));
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [slug, setSlug] = useState("");
  const [unlockAt, setUnlockAt] = useState("");
  const [visibility, setVisibility] = useState("public");

  const isStory = mode === "story";
  let finalSlug = slug || slugify(title, { lower: true, strict: true }) + "-" + Date.now();

  const handleChange = (e) => {
    const updated = [...answers];
    updated[step] = e.target.value;
    setAnswers(updated);
  };

  const handleSingleChange = (e) => setAnswers([e.target.value]);

  const nextStep = () => step < storyChapters.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);

  const generateFullStory = () =>
    storyChapters.map((chapter, index) => `\n\n${chapter.title}\n${answers[index]}`).join("");

  const handleSave = async () => {
    try {
      // Determine what content to save
      const content = isStory ? generateFullStory() : answers[0];

      // Early return only if content is empty
      if (!content || content.trim() === "") {
        console.log("Nothing to save, content is empty");
        return;
      }

      setSaving(true);

      // Auto-generate a title if none provided
      const storyTitle = title && title.trim() !== "" ? title.trim() : "Untitled Story";

      // Optional: if mode is 'openwhen', set unlock date only if provided
      const unlockISO = unlockAt ? new Date(unlockAt).toISOString() : null;

      // Get auth token
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token, cannot save story");
        setSaving(false);
        return;
      }

      // Make the POST request
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: storyTitle,
          content,
          type: mode,
          visibility: visibility || "public",
          unlock_at: unlockISO
        }),
      });

      if (!res.ok) {
        console.error("CREATE FAILED:", await res.json());
        setSaving(false);
        return;
      }

      // Success: parse response and navigate
      const data = await res.json();
      setSlug(data.slug);
      setSaving(false);

      // Confetti animation
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      navigate(`/u/${user.username}/${data.slug}`);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setSaving(false);
    }
  };

  const handleAI = async (type) => {
    try {
      let currentText = null;
      if (isStory) {
        currentText = answers?.[step] || "";
      } else {
        currentText = answers?.[0] || "";
      }

      if (!currentText.trim()) {
        alert("Please write something first ✍️");
        return;
      }

      if (!currentText) return;
      setAiLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentText, type }),
      });

      const data = await res.json();
      const updated = [...answers];
      if (isStory) updated[step] = data.result;
      else updated[0] = data.result;

      setAnswers(updated);
      setAiLoading(false);
    } catch (err) {
      console.error(err);
      setAiLoading(false);
    }
  };

  const bgClass = "bg-animated min-h-screen flex flex-col items-center px-6 py-12";

  // PREVIEW MODE
  if (previewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-100 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-6">
            Preview of your content
          </p>
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">
              {title || (isStory ? "My Life Story" : "My Message")}
            </h1>
            {isStory ? (
              <div className="space-y-6">
                {storyChapters.map((chapter, index) => (
                  <div key={index}>
                    <h2 className="text-xl font-semibold">{chapter.title}</h2>
                    <p className="whitespace-pre-line">{answers[index] || "..."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-line">{answers[0]}</p>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={() => setPreviewMode(false)}>← Back</button>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT EDITOR (Story/Message)
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-purple-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-500">← Back</button>
          <button onClick={handleSave} className="px-4 py-2 bg-black text-white rounded-md">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex gap-3 mb-6 justify-center">
          {["story", "message", "openwhen"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setStep(0);
                setAnswers(Array(storyChapters.length).fill(""));
                setUnlockAt("");
              }}
              className={`px-4 py-2 rounded-full text-sm border ${
                mode === m ? "bg-indigo-600 text-white" : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {m === "story" && "📖 Story"}
              {m === "message" && "💌 Message"}
              {m === "openwhen" && "⏳ Open When…"}
            </button>
          ))}
        </div>

        {mode === "story" && (
          <input
            type="text"
            placeholder="Your Story Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-semibold outline-none mb-6"
          />
        )}

        {isStory && (
          <>
            <p className="text-sm text-gray-500 mb-2">
              Chapter {step + 1} of {storyChapters.length}
            </p>
            <h2 className="text-2xl font-bold">{storyChapters[step].title}</h2>
            <p className="text-gray-500 mb-4">{storyChapters[step].subtitle}</p>
            <p className="mb-3 font-medium">{storyChapters[step].prompt}</p>
            <textarea
              value={answers[step] || ""}
              onChange={(e) => {
                handleChange(e);
              }}
              rows={6}
              className="w-full border rounded-xl p-4 mb-4"
            />
              <div className="flex gap-2 flex-wrap mb-4">
                {["improve", "emotional", "expand"].map((t) => (
                  <button
                    key={t}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAI(t);
                    }}
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
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} disabled={step === 0}>Back</button>
              {step === storyChapters.length - 1 ? (
                <button onClick={() => setPreviewMode(true)}>Preview</button>
              ) : (
                <button onClick={nextStep}>Next</button>
              )}
            </div>
          </>
        )}

        {/* MESSAGE / OPENWHEN */}
        {!isStory && (
          <>
            {/* Title Dropdown (only for openwhen) */}
            {mode === "openwhen" ? (
              <>
                <label className="block mb-2 font-medium text-gray-700">
                  Message Title
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg p-2 mb-4"
                >
                  <option value="">Select a title...</option>
                  {emotionalHeadings.map((heading, idx) => (
                    <option key={idx} value={heading}>
                      {heading}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <input
                type="text"
                placeholder="Message Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-semibold outline-none mb-6"
              />
            )}

            {/* Message Textarea */}
            <textarea
              value={answers[0]}
              onChange={handleSingleChange}
              rows={8}
              placeholder="Write your message..."
              className="w-full border rounded-xl p-4 mb-4"
            />

            {/* AI Buttons */}
            <div className="flex gap-3 mt-2 flex-wrap mb-4">
              {["improve", "emotional", "expand"].map((t) => (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAI(t);
                  }}
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

            {/* Unlock Date ONLY for openwhen */}
            {mode === "openwhen" && (
              <>
                <label className="block mb-2 font-medium text-gray-700">
                  Unlock Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={unlockAt}
                  onChange={(e) => setUnlockAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full border rounded-lg p-2 mb-4"
                />
              </>
            )}
          </>
        )}

        {/* Privacy Tabs + Save Button */}
        <div className="flex justify-between items-center mt-6">
          {/* Privacy Tabs */}
          <div className="flex space-x-2">
            {["public", "followers", "private"].map((option) => (
              <button
                key={option}
                onClick={() => setVisibility(option)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  visibility === option
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option === "public" && "🌍 Public"}
                {option === "followers" && "🔒 Followers Only"}
                {option === "private" && "📝 Only Me"}
              </button>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            disabled={!answers[0] || !title || saving || (mode === "openwhen" && !unlockAt)}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default EditorPage;