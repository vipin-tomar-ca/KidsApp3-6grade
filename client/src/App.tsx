import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/math" component={Math} />
      <Route path="/reading" component={Reading} />
      <Route path="/science" component={Science} />
      <Route path="/art" component={Art} />
      <Route path="/library" component={Library} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
