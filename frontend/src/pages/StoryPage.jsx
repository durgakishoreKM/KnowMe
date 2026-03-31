import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import QRWithLogo from "../components/QRWithLogo";
import CountdownTimer from "../components/CountdownTimer";

const StoryPage = () => {
  const { username, slug } = useParams();

  const [story, setStory] = useState(null);
  const [copied, setCopied] = useState(false);

  const qrRef = useRef(null);

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
              ...(token && { Authorization: `Bearer ${token}` }), // ✅ optional
            },
            cache: "no-store"
          }
        );

        const data = await res.json();

        // IMPORTANT CHANGE: accept mode-based response
        if (data && data.mode) {
          setStory(data);
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
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${window.location.origin}/u/${username}/${slug}`;

  const handleDownloadQR = () => {
    try {
      const qrContainer = qrRef.current;
      if (!qrContainer) {
        alert("QR not ready");
        return;
      }

      const canvasEl = qrContainer.querySelector("canvas");

      if (!canvasEl) {
        alert("QR not rendered yet");
        return;
      }

      // create new canvas (bigger with title)
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = 320;
      finalCanvas.height = 420;

      const ctx = finalCanvas.getContext("2d");

      // background
      const gradient = ctx.createLinearGradient(0, 0, 0, finalCanvas.height);
      gradient.addColorStop(0, "#fdf2f8");
      gradient.addColorStop(1, "#eef2ff");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // title
      ctx.fillStyle = "#111827";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";

      const title = story?.title || "KnowMe Message";
      ctx.fillText(title, finalCanvas.width / 2, 40);

      // white card background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(25, 60, 270, 270);

      // draw QR
      ctx.drawImage(canvasEl, 35, 70, 250, 250);

      // footer
      ctx.fillText("Scan to view", finalCanvas.width / 2, 340);

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#6b7280";
      ctx.fillText("Created with KnowMe", finalCanvas.width / 2, 390);

      // download
      const url = finalCanvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = url;
      a.download = "knowme-share.png";
      a.click();

    } catch (err) {
      console.error("QR DOWNLOAD ERROR:", err);
      alert("Download failed");
    }
  };

  // NOT FOUND
  if (story === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Story not found 😔
      </div>
    );
  }

  // LOCKED STATE
  if (story.mode === "locked") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold mb-4">
          🔒 This message is waiting for you
        </h1>

        <p className="text-gray-500 mb-6">
          It will open soon...
        </p>

        <CountdownTimer unlockAt={story.unlockAt} />
      </div>
    );
  }

  // FULL STORY
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-100 text-gray-800 px-6 py-16">

      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-6 text-pink-400 text-sm">
          ✿ ✿ ✿
        </div>

        <div className="text-center mb-4">
          <span className="text-xs text-indigo-500 uppercase tracking-wider">
            {story.type === "story" && "📖 Life Story"}
            {story.type === "message" && "💌 Message"}
            {story.type === "openwhen" && "⏳ Open When"}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 leading-tight text-gray-900">
          {story.title || "Untitled"}
        </h1>

        <div className="bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-lg">
          <div className="text-gray-700 text-lg leading-8 whitespace-pre-line">
            {story.content || "No content available"}
          </div>
        </div>

        {/* QR */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-3">
            Share your message
          </p>

          <div
            ref={qrRef}
            className="inline-block p-6 bg-white rounded-xl shadow-sm text-center"
          >
            {/* TITLE ABOVE QR */}
            <p className="text-sm font-semibold mb-2 text-gray-700">
              {story.title || "KnowMe Message"}
            </p>

            <div ref={qrRef}>
              <QRWithLogo url={shareUrl} />
            </div>

            {/* SMALL BRANDING */}
            <p className="text-xs text-gray-400 mt-2">
              Scan to view
            </p>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Scan to view this message
          </p>

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

        {/* SHARE */}
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

        {/* ENGAGEMENT */}
        <div className="flex justify-center gap-8 mt-10 text-sm text-gray-500">
          <span>❤️ {story.likes || 0}</span>
          <span>💬 {story.comments || 0}</span>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">
            Create your own moment
          </h3>

          <p className="text-gray-500 mb-6">
            Write something that matters — now or for the future
          </p>

          <a
            href="/create"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Start Creating
          </a>
        </div>

      </div>
    </div>
  );
};

export default StoryPage;