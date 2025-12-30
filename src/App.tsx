import { Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Navbar } from "./components/Navbar";
import { AddMessagePage } from "./pages/AddMessagePage";

function App() {
  return (
    <div className="min-h-screen bg-white text-black transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-message" element={<AddMessagePage />} />
          </Routes>
      </div>
    </div>
  )
}

export default App