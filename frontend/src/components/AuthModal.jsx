import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target. name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!form.email || !form.password || (!isLogin && !form.username)) {
        alert("Please fill all required fields");
        return;
      }

      // ✅ EMAIL VALIDATION
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        alert("Please enter a valid email");
        return;
      }

      // ✅ PASSWORD VALIDATION
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(form.password)) {
        alert("Password must be at least 6 characters and include at least 1 letter and 1 number");
        return;
      }

      const url = isLogin
        ? "/api/auth/login"
        : "/api/auth/signup";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password 
          };

      const res = await fetch(import.meta.env.VITE_API_URL + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Save token and user
      login(data.user, data.token);

      // ✅ Trigger success (redirect handled in parent)
      if (onSuccess) {
        onSuccess(data.user); // ✅ triggers modal close
      }

      // Reset form
      setForm({ username: "", email: "", password: "" });

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {/* NAME (only for signup) */}
        {!isLogin && (
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border px-3 py-2 rounded mb-3"
          />
        )}

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Create Account"}
        </button>

        {/* TOGGLE */}
        <p className="mt-4 text-sm text-center">
          {isLogin ? "No account?" : "Already have an account?"}
          <span
            className="text-indigo-600 cursor-pointer ml-1 font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create one" : "Login"}
          </span>
        </p>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full"
        >
          Close
        </button>

      </div>
    </div>
  );
}