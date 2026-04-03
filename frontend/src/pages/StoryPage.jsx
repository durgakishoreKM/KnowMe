import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import QRWithLogo from "../components/QRWithLogo";
import CountdownTimer from "../components/CountdownTimer";

const StoryPage = () => {
  const { username, slug } = useParams();
  const [story, setStory] = useState(null);
  const [locked, setLocked] = useState(false);
  const [unlockDate, setUnlockDate] = useState(null);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const shareUrl = `${window.location.origin}/u/${username}/${slug}`;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/stories/u/${username}/${slug}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (res.status === 403 && data.unlock_at) {
          setLocked(true);
          setUnlockDate(new Date(data.unlock_at));
          setStory({
            ...data,
            title: data.title || "KnowMe Message",
            type: data.type || "openwhen",
          });
        } else if (data && data.mode) {
          setStory(data);
          setLocked(false);
        } else {
          setStory(null);
        }
      } catch (err) {
        console.error(err);
        setStory(null);
      }
    };

    fetchStory();
  }, [username, slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    try {
      const qrContainer = qrRef.current;
      if (!qrContainer) throw new Error("QR not rendered yet");

      const canvasEl = qrContainer.querySelector("canvas");
      if (!canvasEl) throw new Error("Canvas not found");

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = 320;
      finalCanvas.height = 420;
      const ctx = finalCanvas.getContext("2d");

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, finalCanvas.height);
      gradient.addColorStop(0, "#fdf2f8");
      gradient.addColorStop(1, "#eef2ff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Title
      ctx.fillStyle = "#111827";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(story?.title || "KnowMe Message", finalCanvas.width / 2, 40);

      // White card for QR
      ctx.fillStyle = "#fff";
      ctx.fillRect(25, 60, 270, 270);

      // Draw QR
      ctx.drawImage(canvasEl, 35, 70, 250, 250);

      // Footer
      ctx.fillText("Scan to view", finalCanvas.width / 2, 340);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Created with KnowMe", finalCanvas.width / 2, 390);

      // Download
      const url = finalCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "knowme-share.png";
      a.click();
    } catch (err) {
      console.error(err);
      alert("QR download failed");
    }
  };

  if (story === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Story not found 😔
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-100 text-gray-800 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 text-pink-400 text-sm">✿ ✿ ✿</div>
        <div className="text-center mb-4">
          <span className="text-xs text-indigo-500 uppercase tracking-wider">
            {story.type === "story" && "📖 Life Story"}
            {story.type === "message" && "💌 Message"}
            {story.type === "openwhen" && "⏳ Open When"}
          </span>
        </div>

        {/* Title + Countdown */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {story.title || "Untitled"}
          </h1>
          {locked && unlockDate && (
            <div className="mt-2 text-gray-500 text-sm flex flex-col items-center gap-1">
              <span>🔒 Will unlock in:</span>
              <CountdownTimer
                unlockAt={story.unlockAt}
                onUnlock={async () => {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories/u/${username}/${slug}`, {
                    headers: {
                      "Content-Type": "application/json",
                      ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    cache: "no-store",
                  });
                  const data = await res.json();
                  setStory(data); // update the story in state
                }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        {!locked && (
          <div className="bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-lg">
            <div className="text-gray-700 text-lg leading-8 whitespace-pre-line">
              {story.content || "No content available"}
            </div>
          </div>
        )}

        {/* QR Section */}
        {!locked && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-3">Share your message</p>

            <div
              ref={qrRef}
              className="inline-block p-6 bg-white rounded-xl shadow-sm text-center"
            >
              <p className="text-sm font-semibold mb-2 text-gray-700">
                {story.title || "KnowMe Message"}
              </p>
              <QRWithLogo url={shareUrl} />
              <p className="text-xs text-gray-400 mt-2">Scan to view</p>
            </div>

            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              <button
                onClick={handleCopy}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={handleDownloadQR}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Download Share Image
              </button>
            </div>
          </div>
        )}

        {/* Share Buttons */}
        {!locked && (
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Share this
            </h3>
            <p className="text-gray-500 mb-6">
              Let others experience this moment
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={handleCopy}
                className="px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Share on X
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPage;