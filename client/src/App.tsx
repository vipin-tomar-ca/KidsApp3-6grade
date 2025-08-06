import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Math from "@/pages/math";
import Reading from "@/pages/reading";
import Science from "@/pages/science";
import Art from "@/pages/art";
import Library from "@/pages/library";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import GradeSelection from "@/pages/grade-selection";
import SubjectSelection from "@/pages/subject-selection";
import MusicPage from "@/pages/music";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<GradeSelection />} />
            <Route path="/grade-selection" element={<GradeSelection />} />
            <Route path="/subjects" element={<SubjectSelection />} />
            <Route path="/home" element={<Home />} />
            <Route path="/math" element={<Math />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/english" element={<Reading />} />
            <Route path="/science" element={<Science />} />
            <Route path="/social-studies" element={<Science />} />
            <Route path="/art" element={<Art />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
