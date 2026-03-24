import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import CreatePage from "./pages/CreatePage";
import EditorPage from "./pages/EditorPage";
import StoryPage from "./pages/StoryPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>

      {/* 🌐 Layout Wrapper */}
      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/u/:username/:slug" element={<StoryPage />} />
        <Route path="/u/:username" element={<ProfilePage />} />

      </Route>

    </Routes>
  );
}

export default App;