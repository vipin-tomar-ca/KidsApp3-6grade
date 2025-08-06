import { Route, Router } from "wouter";
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
import CreativeActivities from "@/components/CreativeActivities";
import MultimediaGuide from "@/pages/multimedia-guide";
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
            <Route path="/" component={GradeSelection} />
            <Route path="/grade-selection" component={GradeSelection} />
            <Route path="/subject-selection" component={SubjectSelection} />
            <Route path="/subjects" component={SubjectSelection} />
            <Route path="/home" component={Home} />
            <Route path="/math" component={Math} />
            <Route path="/reading" component={Reading} />
            <Route path="/english" component={Reading} />
            <Route path="/science" component={Science} />
            <Route path="/social-studies" component={Science} />
            <Route path="/art" component={Art} />
            <Route path="/music" component={MusicPage} />
            <Route path="/olympiad" component={OlympiadPage} />
            <Route path="/competition" component={CompetitionPage} />
            <Route path="/workspace" component={WorkspacePage} />
            <Route path="/content-browser" component={ContentBrowser} />
            <Route path="/creative" component={CreativeActivities} />
            <Route path="/multimedia-guide" component={MultimediaGuide} />
            <Route path="/integrity-demo" component={IntegrityDemo} />
            <Route path="/llm-demo" component={LLMDemo} />
            <Route path="/firebase-demo" component={FirebaseDemo} />
            <Route path="/library" component={Library} />
            <Route path="/profile" component={Profile} />
            <Route path="/settings" component={Settings} />
            {/* Fallback to 404 */}
            <Route component={NotFound} />
          </Router>
          <ComplianceFooter />
        </ChildSafetyWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
