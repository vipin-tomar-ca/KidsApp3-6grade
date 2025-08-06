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
import OlympiadPage from "@/pages/olympiad";
import CompetitionPage from "@/pages/competition";
import WorkspacePage from "@/pages/workspace";
import ContentBrowser from "@/pages/content-browser";
import ChildSafetyWrapper from "@/components/ChildSafetyWrapper";
import ComplianceFooter from "@/components/ComplianceFooter";
import IntegrityDemo from "@/pages/integrity-demo";
import LLMDemo from "@/pages/llm-demo";
import FirebaseDemo from "@/pages/firebase-demo";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChildSafetyWrapper>
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
            <Route path="/olympiad" element={<OlympiadPage />} />
            <Route path="/competition" element={<CompetitionPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/content-browser" element={<ContentBrowser />} />
            <Route path="/integrity-demo" element={<IntegrityDemo />} />
            <Route path="/llm-demo" element={<LLMDemo />} />
            <Route path="/firebase-demo" element={<FirebaseDemo />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ComplianceFooter />
        </Router>
        </ChildSafetyWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
